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
		<div className='relative group/editor'>
			{/* Панель инструментов сверху */}
			<div className='flex items-center justify-between mb-2 px-1'>
				<div className='flex gap-1 flex-wrap opacity-70 group-focus-within/editor:opacity-100 transition-opacity'>
					<Button
						type='button'
						variant='ghost'
						size='sm'
						className='h-7 px-2'
						onMouseDown={e => e.preventDefault()}
						onClick={() => handleWrapClick('**')}
						title='Жирный (Ctrl+B)'
					>
						<b className='text-xs'>B</b>
					</Button>
					<Button
						type='button'
						variant='ghost'
						size='sm'
						className='h-7 px-2'
						onMouseDown={e => e.preventDefault()}
						onClick={() => handleWrapClick('*')}
						title='Курсив (Ctrl+I)'
					>
						<i className='text-xs'>I</i>
					</Button>
					<Button
						type='button'
						variant='ghost'
						size='sm'
						className='h-7 px-2'
						onMouseDown={e => e.preventDefault()}
						onClick={handleStrikeThroughClick}
						title='Зачёркнутый'
					>
						<s className='text-xs'>S</s>
					</Button>
					<div className='w-px h-5 bg-border mx-1' />
					<Button
						type='button'
						variant='ghost'
						size='sm'
						className='h-7 px-2'
						onMouseDown={e => e.preventDefault()}
						onClick={() => handleHeaderClick(2)}
						title='Заголовок H2'
					>
						<span className='text-xs font-bold'>H2</span>
					</Button>
					<Button
						type='button'
						variant='ghost'
						size='sm'
						className='h-7 px-2'
						onMouseDown={e => e.preventDefault()}
						onClick={() => handleHeaderClick(3)}
						title='Заголовок H3'
					>
						<span className='text-xs font-bold'>H3</span>
					</Button>
					<div className='w-px h-5 bg-border mx-1' />
					<Button
						type='button'
						variant='ghost'
						size='sm'
						className='h-7 px-2'
						onMouseDown={e => e.preventDefault()}
						onClick={() => handleListClick(false)}
						title='Маркированный список'
					>
						<ListIcon size={14} />
					</Button>
					<Button
						type='button'
						variant='ghost'
						size='sm'
						className='h-7 px-2'
						onMouseDown={e => e.preventDefault()}
						onClick={() => handleListClick(true)}
						title='Нумерованный список'
					>
						<ListOrderedIcon size={14} />
					</Button>
					<Button
						type='button'
						variant='ghost'
						size='sm'
						className='h-7 px-2'
						onMouseDown={e => e.preventDefault()}
						onClick={handleQuoteClick}
						title='Цитата'
					>
						<Quote size={14} />
					</Button>
					<div className='w-px h-5 bg-border mx-1' />
					<Button
						type='button'
						variant='ghost'
						size='sm'
						className='h-7 px-2'
						onMouseDown={e => e.preventDefault()}
						onClick={handleLinkClick}
						title='Ссылка'
					>
						<Link size={14} />
					</Button>
					<Button
						type='button'
						variant='ghost'
						size='sm'
						className='h-7 px-2'
						onMouseDown={e => e.preventDefault()}
						onClick={handleImageClick}
						title='Изображение'
					>
						<ImageSvg size={14} />
					</Button>
					<Button
						type='button'
						variant='ghost'
						size='sm'
						className='h-7 px-2 font-mono'
						onMouseDown={e => e.preventDefault()}
						onClick={handleCodeBlockClick}
						title='Блок кода'
					>
						<span className='text-xs'>{'{}'}</span>
					</Button>
					<Button
						type='button'
						variant='ghost'
						size='sm'
						className='h-7 px-2'
						onMouseDown={e => e.preventDefault()}
						onClick={handleHorizontalLineClick}
						title='Горизонтальная линия'
					>
						<SeparatorHorizontal size={14} />
					</Button>
				</div>
				<Button
					type='button'
					variant={showPreview ? 'secondary' : 'ghost'}
					size='sm'
					onClick={togglePreview}
					className='h-7 px-2 gap-1'
				>
					{showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
					<span className='text-xs hidden sm:inline'>{showPreview ? 'Редактор' : 'Просмотр'}</span>
				</Button>
			</div>

			{showPreview ? (
				<div className='w-full min-h-[120px] rounded-lg p-3 text-sm border border-border/50 bg-muted/30'>
					{value ? (
						<ReactMarkdown>{value}</ReactMarkdown>
					) : (
						<span className='text-muted-foreground italic'>Предпросмотр пуст...</span>
					)}
				</div>
			) : (
				<div className='relative'>
					<textarea
						value={value}
						onChange={handleChange}
						onKeyDown={handleKeyDown}
						onSelect={updateToolbar}
						onBlur={() => setShowToolbar(false)}
						placeholder={placeholder}
						disabled={disabled}
						spellCheck={true}
						ref={editableRef}
						className={cn(
							'w-full min-h-[120px] resize-none rounded-lg p-3 pr-12 text-sm',
							'bg-background/50 border border-border/50',
							'placeholder:text-muted-foreground/60',
							'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50',
							'transition-all duration-200',
							'whitespace-pre-wrap break-words',
							attr.className,
							disabled ? 'pointer-events-none opacity-60' : ''
						)}
						{...restAttr}
						style={{
							wordBreak: 'break-word',
							minHeight: '120px',
							...(attr.style || {}),
						}}
					/>
					{onSubmit && (
						<button
							type='button'
							onClick={submitHandler}
							disabled={disabled || loading || !value.trim()}
							aria-label={loading ? 'Отправка...' : 'Отправить'}
							title='Отправить (Ctrl+Enter)'
							className={cn(
								'absolute right-3 bottom-3 p-2 rounded-full transition-all duration-200',
								'text-muted-foreground hover:text-primary hover:bg-primary/10',
								'disabled:opacity-40 disabled:cursor-not-allowed'
							)}
						>
							{loading ? (
								<svg
									className='animate-spin h-5 w-5'
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 24 24'
									fill='none'
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
								<ArrowRightCircle className='w-5 h-5' />
							)}
						</button>
					)}
				</div>
			)}

			{error && (
				<div className='text-sm text-destructive mt-2 px-1'>
					{error}
				</div>
			)}
			
			<p className='text-xs text-muted-foreground/60 mt-2 px-1'>
				Поддерживается Markdown. Ctrl+Enter для отправки.
			</p>
		</div>
	);
};
