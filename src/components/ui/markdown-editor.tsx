"use client";

import { HTMLAttributes, useCallback, useRef, useState } from "react";
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
} from "lucide-react";
import { Button } from "./button";
import { Markdown as ReactMarkdown } from "./markdown";
import { cn } from "@/lib/utils";

// Получение позиции курсора и выделения для textarea
function getSelectionOffsets(textarea: HTMLTextAreaElement) {
  return { start: textarea.selectionStart, end: textarea.selectionEnd };
}

// Установка позиции курсора для textarea
function setSelectionOffsets(textarea: HTMLTextAreaElement, start: number, end: number) {
  textarea.setSelectionRange(start, end);
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
  after: string,
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
  prefix: string,
) => {
  // Расширяем выделение до целых строк
  let lineStart = selectionStart;
  while (lineStart > 0 && text[lineStart - 1] !== "\n") lineStart--;
  let lineEnd = selectionEnd;
  while (lineEnd < text.length && text[lineEnd] !== "\n") lineEnd++;

  const selectedText = text.slice(lineStart, lineEnd);
  const lines = selectedText.split("\n");
  const updated = lines
    .map((line) => {
      // Если уже есть такой префикс, не дублируем
      if (line.startsWith(prefix)) return line;
      return prefix + line;
    })
    .join("\n");

  const newText = text.slice(0, lineStart) + updated + text.slice(lineEnd);
  const cursor = lineEnd + (updated.length - selectedText.length);
  return { text: newText, cursor };
};

export const MarkdownEditor = ({
  value: externalValue,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = "Введите комментарий (поддерживается Markdown)",
  ...attr
}: MarkdownEditorProps & HTMLAttributes<HTMLTextAreaElement>) => {
  const isControlled = externalValue !== undefined && onChange !== undefined;
  const [internalValue, setInternalValue] = useState("");
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

  const editableRef = useRef<HTMLTextAreaElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });

  const undoStack = useRef<{ history: string[]; timeout: ReturnType<typeof setTimeout> | null }>({ history: [], timeout: null });
  const redoStack = useRef<string[]>([]);

  const adjustHeight = useCallback(() => {
		const el = editableRef.current;
		if (!el) return;

		// Сбрасываем высоту, чтобы правильно посчитать scrollHeight
		el.style.height = 'auto';
		// Устанавливаем новую высоту (минимум 120px, максимум — по желанию)
		el.style.height = `${Math.max(el.scrollHeight, 120)}px`;
	}, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue !== value) {
      // Debounce undo push
      if (undoStack.current.timeout !== null) {
        clearTimeout(undoStack.current.timeout);
      }
      undoStack.current.timeout = setTimeout(() => {
        undoStack.current.history.push(value);
        redoStack.current = [];
      }, 300);
      adjustHeight()
      setValue(newValue);
    }
  };

  // Удаляем style из attr, чтобы не было ошибки типов
  const restAttr = Object.fromEntries(
    Object.entries(attr).filter(([k]) => k !== "style" && k !== "value" && k !== "placeholder" && k !== "onChange"),
  );

const updateToolbar = () => {
	const editable = editableRef.current;
	if (!editable) return setShowToolbar(false);

	// Сначала проверяем наличие выделения
	const selection = window.getSelection();

	// Если selection пустой, пробуем получить его из документа
	if (!selection || selection.rangeCount === 0) {
		// Пробуем получить выделение из конкретного элемента
		const editableSelection = editable.ownerDocument.getSelection();
		if (!editableSelection || editableSelection.rangeCount === 0) {
			console.log('No selection found');
			return setShowToolbar(false);
		}
	}

	// Проверяем, что выделение не пустое
	if (selection!.isCollapsed || selection!.type === 'None') {
		console.log('Selection is collapsed or None');
		return setShowToolbar(false);
	}

	// Проверяем, что выделение находится внутри нашего редактора
	const range = selection!.getRangeAt(0);
	const commonAncestor = range.commonAncestorContainer;

	// Проверяем, что выделение внутри нашего editable элемента
	if (!editable.contains(commonAncestor)) {
		console.log('Selection is outside of editable');
		return setShowToolbar(false);
	}

	const { start, end } = getSelectionOffsets(editable);
	if (start === end) {
		console.log('Start equals end');
		return setShowToolbar(false);
	}

	// Получаем координаты
	let rect = range.getBoundingClientRect();

	// Если rect пустой, используем альтернативные методы
	if (rect.width === 0 || rect.height === 0) {
		const rects = range.getClientRects();
		if (rects.length > 0) {
			rect = rects[0];
		} else {
			console.log('Could not get selection rect');
			return setShowToolbar(false);
		}
	}

	const parentRect = editable.getBoundingClientRect();
	const toolbarHeight = toolbarRef.current?.offsetHeight || 40;

	console.log('Positioning toolbar:', {
		rect,
		parentRect,
		toolbarHeight,
		scroll: { top: editable.scrollTop, left: editable.scrollLeft },
	});

	setToolbarPosition({
		top: rect.top - parentRect.top - toolbarHeight - 8 + editable.scrollTop,
		left: rect.left - parentRect.left + rect.width / 2 + editable.scrollLeft,
	});

	setShowToolbar(true);
};


  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Undo (Ctrl+Z)
    if (e.ctrlKey && !e.shiftKey && e.key === "z") {
      e.preventDefault();
      if (undoStack.current.history.length > 0) {
        redoStack.current.push(value);
        const prev = undoStack.current.history.pop()!;
        setValue(prev);
      }
      return;
    }
    // Redo (Ctrl+Y or Ctrl+Shift+Z)
    if (
      (e.ctrlKey && e.key === "y") ||
      (e.ctrlKey && e.shiftKey && e.key === "z")
    ) {
      e.preventDefault();
      if (redoStack.current.length > 0) {
        undoStack.current.history.push(value);
        const next = redoStack.current.pop()!;
        setValue(next);
      }
      return;
    }
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      submitHandler();
    }
  };

  const submitHandler = () => {
    if (!onSubmit) return;
    if (!value.trim()) return setError("Комментарий не может быть пустым");
    setError(null);
    setLoading(true);
    Promise.resolve(onSubmit(value))
      .catch(() => setError("Ошибка отправки"))
      .finally(() => {
        setValue("");
        setLoading(false);
      });
  };

  const handleWrapClick = (before: string, after: string = before) => {
    const editable = editableRef.current;
    if (!editable) return;
    const { start, end } = getSelectionOffsets(editable);
    const result = applyWrap(value, start, end, before, after);
    undoStack.current.history.push(value);
    redoStack.current = [];
    setValue(result.text);
    editable.focus();
    setSelectionOffsets(editable, result.cursor, result.cursor);
  };

  const handleListClick = (ordered: boolean) => {
    const editable = editableRef.current;
    if (!editable) return;
    const { start, end } = getSelectionOffsets(editable);
    const prefix = ordered ? "1. " : "- ";
    const result = applyLinePrefix(value, start, end, prefix);
    undoStack.current.history.push(value);
    redoStack.current = [];
    setValue(result.text);
    editable.focus();
    setSelectionOffsets(editable, result.cursor, result.cursor);
  };

  const handleHeaderClick = (level: number) => {
    const editable = editableRef.current;
    if (!editable) return;
    const { start, end } = getSelectionOffsets(editable);
    const prefix = "#".repeat(level) + " ";
    const result = applyLinePrefix(value, start, end, prefix);
    undoStack.current.history.push(value);
    redoStack.current = [];
    setValue(result.text);
    editable.focus();
    setSelectionOffsets(editable, result.cursor, result.cursor);
  };

  const handleStrikeThroughClick = () => {
    const editable = editableRef.current;
    if (!editable) return;
    const { start, end } = getSelectionOffsets(editable);
    const result = applyWrap(value, start, end, "~~", "~~");
    undoStack.current.history.push(value);
    redoStack.current = [];
    setValue(result.text);
    editable.focus();
    setSelectionOffsets(editable, result.cursor, result.cursor);
  };

  const handleLinkClick = () => {
    const editable = editableRef.current;
    if (!editable) return;
    const { start, end } = getSelectionOffsets(editable);
    const selectedText = value.slice(start, end);
    undoStack.current.history.push(value);
    redoStack.current = [];
    if (selectedText) {
      const result = applyWrap(value, start, end, "[", "](url)");
      setValue(result.text);
      editable.focus();
      setSelectionOffsets(editable, end + 3, end + 3);
    } else {
      const result = applyWrap(value, start, end, "[текст](", ")");
      setValue(result.text);
      editable.focus();
      setSelectionOffsets(editable, start + 1, start + 1);
    }
  };

  const handleImageClick = () => {
    const editable = editableRef.current;
    if (!editable) return;
    const { start, end } = getSelectionOffsets(editable);
    const selectedText = value.slice(start, end);
    undoStack.current.history.push(value);
    redoStack.current = [];
    if (selectedText) {
      const result = applyWrap(value, start, end, "![", "](url)");
      setValue(result.text);
      editable.focus();
      setSelectionOffsets(editable, end + 4, end + 4);
    } else {
      const result = applyWrap(value, start, end, "![описание](", ")");
      setValue(result.text);
      editable.focus();
      setSelectionOffsets(editable, start + 2, start + 2);
    }
  };

  const handleCodeBlockClick = () => {
    const editable = editableRef.current;
    if (!editable) return;
    const { start, end } = getSelectionOffsets(editable);
    const result = applyWrap(value, start, end, "```\n", "\n```");
    undoStack.current.history.push(value);
    redoStack.current = [];
    setValue(result.text);
    editable.focus();
    setSelectionOffsets(editable, result.cursor, result.cursor);
  };

  const handleQuoteClick = () => {
    const editable = editableRef.current;
    if (!editable) return;
    const { start, end } = getSelectionOffsets(editable);
    const result = applyLinePrefix(value, start, end, "> ");
    undoStack.current.history.push(value);
    redoStack.current = [];
    setValue(result.text);
    editable.focus();
    setSelectionOffsets(editable, result.cursor, result.cursor);
  };

  const handleHorizontalLineClick = () => {
    const editable = editableRef.current;
    if (!editable) return;
    const { start, end } = getSelectionOffsets(editable);
    undoStack.current.history.push(value);
    redoStack.current = [];
    let prefix = "";
    let suffix = "\n";
    if (start > 0 && value[start - 1] !== "\n") {
      prefix = "\n";
    }
    if (end < value.length && value[end] !== "\n") {
      suffix = "\n\n";
    } else if (end === value.length) {
      suffix = "\n";
    }
    const newText =
      value.slice(0, start) + prefix + "---" + suffix + value.slice(end);
    setValue(newText);
    editable.focus();
    setSelectionOffsets(editable, start + prefix.length + 3 + suffix.length, start + prefix.length + 3 + suffix.length);
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

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
								transition: 'top 0.2s ease-in-out, left 0.2s ease-in-out',
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
					<textarea
						value={value}
						onChange={handleChange}
						onKeyDown={handleKeyDown}
						onSelect={updateToolbar}
						onBlur={() => {
							setShowToolbar(false);
						}}
						placeholder={placeholder}
						disabled={disabled}
						spellCheck={true}
						ref={editableRef}
						className={cn(
							'w-full min-h-[100px] resize-none bg-transparent shadow-sm backdrop-blur-[10px] rounded-lg p-2 pr-5 border-[1px] border-none text-sm outline-none dark:shadow-[0_2px_10px_rgba(81,81,81,0.6),_0_0_1px_rgba(255,255,255,0.05)] focus-visible:ring-ring focus-visible:border-none',
							'whitespace-pre-wrap break-words',
							attr.className,
							disabled ? 'pointer-events-none opacity-60' : ''
						)}
						{...restAttr}
						style={{
							wordBreak: 'break-word',
							outline: 'none',
							minHeight: '100px',
							...(attr.style || {}),
						}}
					/>
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
		</div>
	);
};
