'use client';

import { HTMLAttributes, useRef, useState, useLayoutEffect } from 'react';
import {
	Image as ImageSvg,
	Link,
	ListIcon,
	ListOrderedIcon,
	Quote,
	SeparatorHorizontal,
	Eye,
	EyeOff,
	ArrowRightCircle,
} from 'lucide-react';
import { Button } from './button';
import { Markdown as ReactMarkdown } from './markdown';
import { cn } from '@/lib/utils';

// Получение позиции курсора и выделения для contenteditable div
function getSelectionOffsets(editableDiv: HTMLDivElement) {
	const selection = window.getSelection();
	if (!selection || selection.rangeCount === 0) return { start: 0, end: 0 };
	const range = selection.getRangeAt(0);
	const preCaretRange = range.cloneRange();
	preCaretRange.selectNodeContents(editableDiv);
	preCaretRange.setEnd(range.startContainer, range.startOffset);
	const start = preCaretRange.toString().length;
	const postCaretRange = range.cloneRange();
	postCaretRange.selectNodeContents(editableDiv);
	postCaretRange.setEnd(range.endContainer, range.endOffset);
	const end = postCaretRange.toString().length;
	return { start, end };
}

// Установка позиции курсора для contenteditable div
function setSelectionOffsets(
	editableDiv: HTMLDivElement,
	start: number,
	end: number
) {
	const setPos = (
		el: Node,
		pos: number
	): { node: Node; offset: number } | null => {
		const stack: Node[] = [el];
		let chars = 0;
		while (stack.length) {
			const node = stack.shift()!;
			if (node.nodeType === Node.TEXT_NODE) {
				const text = node.textContent || '';
				if (chars + text.length >= pos) {
					return { node, offset: pos - chars };
				}
				chars += text.length;
			} else if (node.nodeType === Node.ELEMENT_NODE) {
				for (let i = 0; i < node.childNodes.length; i++) {
					stack.push(node.childNodes[i]);
				}
			}
		}
		return null;
	};
	const selection = window.getSelection();
	if (!selection) return;
	const startPos = setPos(editableDiv, start);
	const endPos = setPos(editableDiv, end);
	if (startPos && endPos) {
		const range = document.createRange();
		range.setStart(startPos.node, startPos.offset);
		range.setEnd(endPos.node, endPos.offset);
		selection.removeAllRanges();
		selection.addRange(range);
	}
}

type MarkdownEditorProps = {
	value?: string;
	onChange?: (value: string) => void;
	onSubmit?: (value: string) => void;
	disabled?: boolean;
	placeholder?: string;
	required?: boolean;
};

const applyWrap = (
	text: string,
	selectionStart: number,
	selectionEnd: number,
	before: string,
	after: string
) => {
	const selected = text.slice(selectionStart, selectionEnd);
	const newText =
		text.slice(0, selectionStart) +
		before +
		selected +
		after +
		text.slice(selectionEnd);

	// Новый курсор — после вставленного текста с учетом before и after
	const newCursor = selectionEnd + before.length + after.length;
	return { text: newText, cursor: newCursor };
};

const applyLinePrefix = (
	text: string,
	selectionStart: number,
	selectionEnd: number,
	prefix: string
) => {
	const lines = text.slice(selectionStart, selectionEnd).split('\n');
	const updated = lines
		.map(line => {
			// Если уже есть такой префикс, не дублируем
			if (line.startsWith(prefix)) return line;
			return prefix + line;
		})
		.join('\n');

	const newText =
		text.slice(0, selectionStart) + updated + text.slice(selectionEnd);

	// Возвращаем длину добавленных символов, чтобы корректно выставить курсор
	const addedLength = prefix.length * lines.length;
	return { text: newText, addedLength };
};

export const MarkdownEditor = ({
	value: externalValue,
	onChange,
	onSubmit,
	disabled = false,
	placeholder = 'Введите комментарий (поддерживается Markdown)',
	...attr
}: MarkdownEditorProps & HTMLAttributes<HTMLTextAreaElement>) => {
	const isControlled = externalValue !== undefined && onChange !== undefined;
	const [internalValue, setInternalValue] = useState('');
	const value = isControlled ? externalValue : internalValue;

	const setValue = (newVal: string) => {
		if (isControlled) {
			onChange?.(newVal);
		} else {
			setInternalValue(newVal);
		}
	};

	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [showToolbar, setShowToolbar] = useState(false);
	const [showPreview, setShowPreview] = useState(false);
	const [isFocused, setIsFocused] = useState(false);

	const editableRef = useRef<HTMLDivElement>(null);
	const toolbarRef = useRef<HTMLDivElement>(null);

	// Для восстановления позиции курсора
	const cursorPositionRef = useRef<{ start: number; end: number } | null>(null);
	const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });

	const prevValue = useRef(value);
	const undoStack = useRef<string[]>([]);
	const redoStack = useRef<string[]>([]);

	// Удаляем style из attr, чтобы не было ошибки типов
	const restAttr = Object.fromEntries(
		Object.entries(attr).filter(([k]) => k !== 'style')
	);

	const updateToolbar = () => {
		const editable = editableRef.current;
		if (!editable) return setShowToolbar(false);
		const { start, end } = getSelectionOffsets(editable);
		if (start === end) return setShowToolbar(false);
		// Получаем координаты выделения
		const selection = window.getSelection();
		if (!selection || selection.rangeCount === 0) return setShowToolbar(false);
		const range = selection.getRangeAt(0);
		const rect = range.getBoundingClientRect();
		const parentRect = editable.getBoundingClientRect();
		const toolbarHeight = toolbarRef.current?.offsetHeight || 40;
		setToolbarPosition({
			top: rect.top - parentRect.top - toolbarHeight - 8 + editable.scrollTop,
			left: rect.left - parentRect.left + editable.scrollLeft,
		});
		setShowToolbar(true);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		// Undo (Ctrl+Z)
		if (e.ctrlKey && !e.shiftKey && e.key === 'z') {
			e.preventDefault();
			if (undoStack.current.length > 0) {
				redoStack.current.push(value);
				const prev = undoStack.current.pop()!;
				setValue(prev);
			}
			return;
		}
		// Redo (Ctrl+Y or Ctrl+Shift+Z)
		if (
			(e.ctrlKey && e.key === 'y') ||
			(e.ctrlKey && e.shiftKey && e.key === 'z')
		) {
			e.preventDefault();
			if (redoStack.current.length > 0) {
				undoStack.current.push(value);
				const next = redoStack.current.pop()!;
				setValue(next);
			}
			return;
		}
		if (e.ctrlKey && e.key === 'Enter') {
			e.preventDefault();
			submitHandler();
		}
	};

	const submitHandler = () => {
		if (!onSubmit) return;
		if (!value.trim()) return setError('Комментарий не может быть пустым');
		setError(null);
		setLoading(true);
		Promise.resolve(onSubmit(value))
			.catch(() => setError('Ошибка отправки'))
			.finally(() => {
				setValue('');
				setLoading(false);
			});
	};

	const handleWrapClick = (before: string, after: string = before) => {
		const editable = editableRef.current;
		if (!editable) return;
		const { start, end } = getSelectionOffsets(editable);
		const result = applyWrap(value, start, end, before, after);
		setValue(result.text);
		cursorPositionRef.current = { start: result.cursor, end: result.cursor };
		editable.focus();
	};

	const handleListClick = (ordered: boolean) => {
		const editable = editableRef.current;
		if (!editable) return;
		const { start, end } = getSelectionOffsets(editable);
		const prefix = ordered ? '1. ' : '- ';
		const result = applyLinePrefix(value, start, end, prefix);
		setValue(result.text);
		const linesCount = value.slice(start, end).split('\n').length;
		const newCursor = end + prefix.length * linesCount;
		cursorPositionRef.current = { start: newCursor, end: newCursor };
		editable.focus();
	};

	const handleHeaderClick = (level: number) => {
		const editable = editableRef.current;
		if (!editable) return;
		const { start, end } = getSelectionOffsets(editable);
		const prefix = '#'.repeat(level) + ' ';
		const result = applyLinePrefix(value, start, end, prefix);
		setValue(result.text);
		const linesCount = value.slice(start, end).split('\n').length;
		const newCursor = end + prefix.length * linesCount;
		cursorPositionRef.current = { start: newCursor, end: newCursor };
		editable.focus();
	};

	const handleStrikeThroughClick = () => {
		const editable = editableRef.current;
		if (!editable) return;
		const { start, end } = getSelectionOffsets(editable);
		const result = applyWrap(value, start, end, '~~', '~~');
		setValue(result.text);
		cursorPositionRef.current = { start: result.cursor, end: result.cursor };
		editable.focus();
	};

	const handleLinkClick = () => {
		const editable = editableRef.current;
		if (!editable) return;
		const { start, end } = getSelectionOffsets(editable);
		const selectedText = value.slice(start, end);
		if (selectedText) {
			const result = applyWrap(value, start, end, '[', '](url)');
			setValue(result.text);
			cursorPositionRef.current = {
				start: end + 3,
				end: end + 3,
			};
		} else {
			const result = applyWrap(value, start, end, '[текст](', ')');
			setValue(result.text);
			cursorPositionRef.current = {
				start: start + 1,
				end: start + 1,
			};
		}
		editable.focus();
	};

	const handleImageClick = () => {
		const editable = editableRef.current;
		if (!editable) return;
		const { start, end } = getSelectionOffsets(editable);
		const selectedText = value.slice(start, end);
		if (selectedText) {
			const result = applyWrap(value, start, end, '![', '](url)');
			setValue(result.text);
			cursorPositionRef.current = {
				start: end + 4,
				end: end + 4,
			};
		} else {
			const result = applyWrap(value, start, end, '![описание](', ')');
			setValue(result.text);
			cursorPositionRef.current = {
				start: start + 2,
				end: start + 2,
			};
		}
		editable.focus();
	};

	const handleCodeBlockClick = () => {
		const editable = editableRef.current;
		if (!editable) return;
		const { start, end } = getSelectionOffsets(editable);
		const result = applyWrap(value, start, end, '```\n', '\n```');
		setValue(result.text);
		cursorPositionRef.current = { start: result.cursor, end: result.cursor };
		editable.focus();
	};

	const handleQuoteClick = () => {
		const editable = editableRef.current;
		if (!editable) return;
		const { start, end } = getSelectionOffsets(editable);
		const result = applyLinePrefix(value, start, end, '> ');
		setValue(result.text);
		const linesCount = value.slice(start, end).split('\n').length;
		const newCursor = end + '> '.length * linesCount;
		cursorPositionRef.current = { start: newCursor, end: newCursor };
		editable.focus();
	};

	const handleHorizontalLineClick = () => {
		const editable = editableRef.current;
		if (!editable) return;
		const { start, end } = getSelectionOffsets(editable);
		let prefix = '';
		let suffix = '\n';
		if (start > 0 && value[start - 1] !== '\n') {
			prefix = '\n';
		}
		if (end < value.length && value[end] !== '\n') {
			suffix = '\n\n';
		} else if (end === value.length) {
			suffix = '\n';
		}
		const newText =
			value.slice(0, start) + prefix + '---' + suffix + value.slice(end);
		setValue(newText);
		cursorPositionRef.current = {
			start: start + prefix.length + 3 + suffix.length,
			end: start + prefix.length + 3 + suffix.length,
		};
		editable.focus();
	};

	const togglePreview = () => {
		setShowPreview(!showPreview);
	};

	const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
		const text = e.currentTarget.textContent?.replace(/\r\n|\r/g, '\n') || '';
		if (text !== value) {
			undoStack.current.push(value);
			redoStack.current = [];
			setValue(text);
		}
		// Сохраняем позицию курсора
		const { start, end } = getSelectionOffsets(e.currentTarget);
		cursorPositionRef.current = { start, end };
	};
	useLayoutEffect(() => {
		if (!editableRef.current) return;
		// Если div пустой, вставить value
		if (!editableRef.current.textContent && value) {
			editableRef.current.textContent = value;
			prevValue.current = value;
		}
		if (value !== prevValue.current) {
			editableRef.current.textContent = value;
			prevValue.current = value;
		}
		// Всегда восстанавливаем позицию курсора, если она есть
		if (cursorPositionRef.current && editableRef.current) {
			setSelectionOffsets(
				editableRef.current,
				cursorPositionRef.current.start,
				cursorPositionRef.current.end
			);
			cursorPositionRef.current = null;
		}
	}, [value, showPreview]);

	return (
		<div className='relative'>
			<div className='sticky top-9 z-50'>
				<Button
					type='button'
					variant='ghost'
					onClick={togglePreview}
					className='absolute p-1 h-6 right-1 top-1 '
				>
					{showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
				</Button>
			</div>

			{showPreview ? (
				<div className='w-full min-h-[100px] rounded-lg p-2 text-sm overflow-visible'>
					{value ? (
						<ReactMarkdown>{value}</ReactMarkdown>
					) : (
						<span className='text-muted-foreground'>Предпросмотр Markdown</span>
					)}
				</div>
			) : (
				<div className='relative' style={{ position: 'relative' }}>
					{showToolbar && (
						<div
							ref={toolbarRef}
							style={{
								position: 'absolute',
								top: toolbarPosition.top,
								left: toolbarPosition.left,
								userSelect: 'none',
								zIndex: 10,
							}}
						>
							<div className='flex gap-1 mb-1 p-1 border-[1px] border-foreground/10 backdrop-blur-[10px] rounded-lg bg-background/30'>
								<Button
									type='button'
									variant={'ghost'}
									className='rounded-lg py-1 h-6'
									onMouseDown={e => e.preventDefault()}
									onClick={() => handleWrapClick('**')}
								>
									<b>B</b>
								</Button>
								<Button
									type='button'
									className='rounded-lg py-1 h-6'
									variant={'ghost'}
									onMouseDown={e => e.preventDefault()}
									onClick={() => handleWrapClick('*')}
								>
									<i>I</i>
								</Button>
								<Button
									type='button'
									className='rounded-lg py-1 h-6'
									variant={'ghost'}
									onMouseDown={e => e.preventDefault()}
									onClick={() => handleListClick(false)}
								>
									<ListIcon size={16} />
								</Button>
								<Button
									type='button'
									className='rounded-lg py-1 h-6'
									variant={'ghost'}
									onMouseDown={e => e.preventDefault()}
									onClick={() => handleListClick(true)}
								>
									<ListOrderedIcon size={16} />
								</Button>
								<Button
									type='button'
									className='rounded-lg py-1 px-2 h-6 font-semibold text-sm'
									variant={'ghost'}
									onMouseDown={e => e.preventDefault()}
									onClick={() => handleHeaderClick(3)}
								>
									H3
								</Button>
								<Button
									type='button'
									className='rounded-lg py-1 px-2 h-6 font-semibold text-sm'
									variant={'ghost'}
									onMouseDown={e => e.preventDefault()}
									onClick={() => handleHeaderClick(4)}
								>
									H4
								</Button>
								<Button
									type='button'
									className='rounded-lg py-1 h-6'
									variant={'ghost'}
									onMouseDown={e => e.preventDefault()}
									onClick={handleStrikeThroughClick}
								>
									abc
								</Button>
								<Button
									type='button'
									className='rounded-lg py-1 h-6'
									variant={'ghost'}
									onMouseDown={e => e.preventDefault()}
									onClick={handleLinkClick}
								>
									<Link size={16} />
								</Button>
								<Button
									type='button'
									className='rounded-lg py-1 h-6'
									variant={'ghost'}
									onMouseDown={e => e.preventDefault()}
									onClick={handleImageClick}
								>
									<ImageSvg size={16} />
								</Button>
								<Button
									type='button'
									className='rounded-lg py-1 h-6 font-mono text-xs'
									variant={'ghost'}
									onMouseDown={e => e.preventDefault()}
									onClick={handleCodeBlockClick}
								>
									{'{...}'}
								</Button>
								<Button
									type='button'
									className='rounded-lg py-1 h-6'
									variant={'ghost'}
									onMouseDown={e => e.preventDefault()}
									onClick={handleQuoteClick}
								>
									<Quote size={16} />
								</Button>
								<Button
									type='button'
									className='rounded-lg py-1 h-6'
									variant={'ghost'}
									onMouseDown={e => e.preventDefault()}
									onClick={handleHorizontalLineClick}
								>
									<SeparatorHorizontal size={16} />
								</Button>
							</div>
						</div>
					)}
					<div
						{...restAttr}
						ref={editableRef}
						contentEditable={!disabled}
						suppressContentEditableWarning={true}
						className={cn(
							'w-full min-h-[100px] resize-none bg-transparent shadow-sm backdrop-blur-[10px] rounded-lg p-2 pr-5 border-[1px] border-none text-sm outline-none dark:shadow-[0_2px_10px_rgba(81,81,81,0.6),_0_0_1px_rgba(255,255,255,0.05)] focus-visible:ring-ring focus-visible:border-none',
							'whitespace-pre-wrap break-words',
							attr.className,
							disabled ? 'pointer-events-none opacity-60' : ''
						)}
						onInput={handleInput}
						onKeyDown={handleKeyDown}
						onMouseUp={updateToolbar}
						onKeyUp={updateToolbar}
						onFocus={() => setIsFocused(true)}
						onBlur={() => {
							setShowToolbar(false);
							setIsFocused(false);
						}}
						spellCheck={true}
						role='textbox'
						aria-multiline='true'
						tabIndex={0}
						data-placeholder={placeholder}
						style={{
							whiteSpace: 'pre-wrap',
							wordBreak: 'break-word',
							outline: 'none',
							minHeight: '100px',
							...(attr.style || {}),
						}}
					>
						{!isFocused && !value && !showPreview && (
							<span
								className='text-muted-foreground pointer-events-none select-none'
								style={{ opacity: 0.7 }}
							>
								{placeholder}
							</span>
						)}
					</div>
					<button
						type='button'
						onClick={submitHandler}
						disabled={disabled || loading || !value.trim()}
						aria-label={loading ? 'Отправка...' : 'Отправить '}
						title={loading ? 'Отправка...' : 'Отправить '}
						className='absolute right-2 bottom-2 p-2 text-foreground hover:text-primary'
					>
						{loading ? (
							<svg
								className='animate-spin h-5 w-5 text-primary fill-primary! stroke-primary'
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 24 24'
							>
								<circle
									className='opacity-25'
									cx='12'
									cy='12'
									r='10'
									stroke='currentColor'
									strokeWidth='4'
								/>
								<path
									className='opacity-75'
									fill='currentColor'
									d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
								/>
							</svg>
						) : (
							onSubmit && <ArrowRightCircle className='w-5 h-5' />
						)}
					</button>
				</div>
			)}

			{error && <div className='text-sm text-red-500 mt-1'>{error}</div>}
			{onSubmit && (
				<div className='text-xs text-center text-gray-500 block'>
					Ctrl + Enter — отправить. Поддерживается Markdown.
				</div>
			)}
		</div>
	);
};
