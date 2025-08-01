import { useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { TextAlign } from '@tiptap/extension-text-align';
import { Extension } from '@tiptap/core';
import { Button } from '@/components/ui/button';
import { 
  Bold, Italic, Underline, Strikethrough, Code, List, ListOrdered,
  Undo, Redo, Quote, Minus, Table as TableIcon, Link as LinkIcon,
  Image as ImageIcon, Palette, Highlighter, AlignLeft, AlignCenter, AlignRight,
  Upload, ChevronDown, AlignJustify
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
}



// Компонент для выбора размера таблицы
function TableSizeSelector({ onSelect, onClose }: { onSelect: (rows: number, cols: number) => void; onClose: () => void }) {
  const [hoveredCell, setHoveredCell] = useState<{row: number, col: number} | null>(null);
  
  const handleCellHover = (row: number, col: number) => {
    setHoveredCell({row, col});
  };
  
  const handleCellClick = (row: number, col: number) => {
    onSelect(row + 1, col + 1);
    onClose();
  };
  
  return (
    <div className="absolute top-full left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-4 mt-1" style={{ width: '280px' }}>
      <div className="text-sm text-gray-700 mb-3 text-center font-medium">
        {hoveredCell ? `${hoveredCell.row + 1} x ${hoveredCell.col + 1}` : 'Вставка таблицы'}
      </div>
      <div 
        className="grid gap-0.5 border border-gray-300 p-2 bg-gray-50 rounded"
        style={{ 
          gridTemplateColumns: 'repeat(10, 20px)',
          gridTemplateRows: 'repeat(10, 20px)',
          width: '220px',
          height: '220px'
        }}
      >
        {Array.from({ length: 100 }, (_, index) => {
          const row = Math.floor(index / 10);
          const col = index % 10;
          const isHighlighted = hoveredCell && row <= hoveredCell.row && col <= hoveredCell.col;
          
          return (
            <div
              key={index}
              className={`border border-gray-400 cursor-pointer transition-all duration-100 ${
                isHighlighted 
                  ? 'bg-blue-500 border-blue-600' 
                  : 'bg-white hover:bg-blue-100'
              }`}
              style={{ width: '20px', height: '20px' }}
              onMouseEnter={() => handleCellHover(row, col)}
              onClick={() => handleCellClick(row, col)}
            />
          );
        })}
      </div>
      <div className="text-xs text-gray-500 mt-3 text-center">
        Наведите для выбора размера, нажмите для вставки
      </div>
    </div>
  );
}

// Компонент палитры цветов
function ColorPalette({ 
  colors, 
  onSelect, 
  onClose,
  title = "Выберите цвет"
}: { 
  colors: string[]; 
  onSelect: (color: string) => void; 
  onClose: () => void;
  title?: string;
}) {
  return (
    <div className="absolute top-full left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-3 mt-1" style={{ width: '200px' }}>
      <div className="text-sm text-gray-700 mb-2 font-medium">
        {title}
      </div>
      <div className="grid grid-cols-8 gap-1 mb-2">
        {colors.map((color, index) => (
          <button
            key={index}
            className="w-6 h-6 border border-gray-300 rounded cursor-pointer hover:scale-105 transition-transform hover:border-blue-400"
            style={{ backgroundColor: color }}
            onClick={() => {
              onSelect(color);
              onClose();
            }}
            title={color}
          />
        ))}
      </div>
      <div className="text-xs text-gray-500 text-center">
        Нажмите на цвет для применения
      </div>
    </div>
  );
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Начните вводить содержание статьи...",
  height = 500 
}: RichTextEditorProps) {
  const [showTableSelector, setShowTableSelector] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [isToolbarSticky, setIsToolbarSticky] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Стандартные цвета - как в Google Docs
  const standardColors = [
    // Первый ряд - базовые цвета
    '#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9900ff', '#ff00ff',
    // Второй ряд - темные оттенки
    '#434343', '#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#351c75', '#741b47',
    // Третий ряд - средние оттенки  
    '#666666', '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#674ea7', '#a64d79',
    // Четвертый ряд - светлые оттенки
    '#999999', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#b4a7d6', '#d5a6bd',
    // Пятый ряд - очень светлые
    '#cccccc', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#d9d2e9', '#ead1dc',
    // Шестой ряд - почти белые
    '#efefef', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'
  ];
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Highlight,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          style: 'max-width: 100%; height: auto; margin: 1em 0;',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          style: 'border-collapse: collapse; border: 1px solid #ddd; width: 100%; margin: 1em 0;',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          style: 'border: 1px solid #ddd; padding: 8px 12px; background-color: #f9fafb; font-weight: 600; text-align: left;',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          style: 'border: 1px solid #ddd; padding: 8px 12px; text-align: left;',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Обработка прокрутки для закрепления панели инструментов
  useEffect(() => {
    const handleScroll = () => {
      if (editorRef.current && toolbarRef.current) {
        const editorRect = editorRef.current.getBoundingClientRect();
        const shouldStick = editorRect.top < 0 && editorRect.bottom > 80;
        setIsToolbarSticky(shouldStick);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Закрытие селекторов при клике вне их
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setShowTableSelector(false);
        setShowColorPicker(false);
        setShowHighlightPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = prompt('Введите URL ссылки:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImageByUrl = () => {
    const url = prompt('Введите URL изображения:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      editor.chain().focus().setImage({ src: data.imageUrl }).run();
      
      toast({
        title: "Изображение добавлено",
        description: "Изображение успешно загружено и добавлено в редактор",
      });
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить изображение",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    } else {
      toast({
        title: "Неверный формат",
        description: "Выберите файл изображения (JPG, PNG, GIF, WebP)",
        variant: "destructive",
      });
    }
    // Очищаем input для возможности выбора того же файла снова
    event.target.value = '';
  };

  const addTable = (rows: number, cols: number) => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
  };

  const setColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  const setHighlight = (color: string) => {
    editor.chain().focus().setHighlight({ color }).run();
  };

  // Состояние для ARIA live объявлений
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  // Функция для озвучивания кнопок через screen reader
  const announceButton = (text: string) => {
    setLiveAnnouncement(text);
    // Очищаем объявление через короткое время, чтобы одинаковые тексты озвучивались повторно
    setTimeout(() => setLiveAnnouncement(''), 100);
  };

  return (
    <div ref={editorRef} className="w-full border rounded-lg overflow-hidden bg-white">
      {/* ARIA Live область для screen reader объявлений */}
      <div 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        {liveAnnouncement}
      </div>
      
      {/* Панель инструментов */}
      <div 
        ref={toolbarRef}
        className={`border-b p-3 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 flex flex-wrap gap-1 transition-all duration-200 ${
          isToolbarSticky ? 'fixed top-0 left-0 right-0 z-40 shadow-lg border-t-0 rounded-none' : ''
        }`}
        style={isToolbarSticky ? { width: '100%' } : {}}
        role="toolbar"
        aria-label="Панель инструментов редактора"
      >
        {/* Форматирование текста */}
        <Button
          type="button"
          variant={editor.isActive('bold') ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          onMouseEnter={() => announceButton('Жирный текст')}
          title="Жирный текст"
          aria-label="Сделать текст жирным"
          aria-pressed={editor.isActive('bold')}
          role="button"
          tabIndex={0}
          className={`h-8 w-8 p-0 transition-all hover:scale-105 ${
            editor.isActive('bold') 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-white hover:bg-blue-600 hover:text-white border-gray-300 hover:border-blue-600'
          }`}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('italic') ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          onMouseEnter={() => announceButton('Курсив')}
          title="Курсив"
          aria-label="Сделать текст курсивным"
          aria-pressed={editor.isActive('italic')}
          role="button"
          tabIndex={0}
          className={`h-8 w-8 p-0 transition-all hover:scale-105 ${
            editor.isActive('italic') 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-white hover:bg-blue-600 hover:text-white border-gray-300 hover:border-blue-600'
          }`}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('underline') ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          onMouseEnter={() => announceButton('Подчёркнутый')}
          title="Подчёркнутый"
          aria-label="Подчеркнуть текст"
          aria-pressed={editor.isActive('underline')}
          role="button"
          tabIndex={0}
          className={`h-8 w-8 p-0 transition-all hover:scale-105 ${
            editor.isActive('underline') 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-white hover:bg-blue-600 hover:text-white border-gray-300 hover:border-blue-600'
          }`}
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('strike') ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          onMouseEnter={() => announceButton('Зачёркнутый')}
          title="Зачёркнутый"
          aria-label="Зачеркнуть текст"
          aria-pressed={editor.isActive('strike')}
          role="button"
          tabIndex={0}
          className={`h-8 w-8 p-0 transition-all hover:scale-105 ${
            editor.isActive('strike') 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-white hover:bg-blue-600 hover:text-white border-gray-300 hover:border-blue-600'
          }`}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('code') ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          onMouseEnter={() => announceButton('Код')}
          title="Код"
          aria-label="Форматировать как код"
          aria-pressed={editor.isActive('code')}
          role="button"
          tabIndex={0}
          className={`h-8 w-8 p-0 transition-all hover:scale-105 ${
            editor.isActive('code') 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-white hover:bg-blue-600 hover:text-white border-gray-300 hover:border-blue-600'
          }`}
        >
          <Code className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-2 self-center" />

        {/* Заголовки */}
        <Select
          value={
            editor.isActive('paragraph') ? 'paragraph' :
            editor.isActive('heading', { level: 1 }) ? '1' :
            editor.isActive('heading', { level: 2 }) ? '2' :
            editor.isActive('heading', { level: 3 }) ? '3' :
            editor.isActive('heading', { level: 4 }) ? '4' :
            editor.isActive('heading', { level: 5 }) ? '5' :
            editor.isActive('heading', { level: 6 }) ? '6' :
            'paragraph'
          }
          onValueChange={(value) => {
            if (value === 'paragraph') {
              editor.chain().focus().setParagraph().run();
            } else {
              editor.chain().focus().toggleHeading({ level: parseInt(value) as any }).run();
            }
          }}
        >
          <SelectTrigger 
            className="w-32 h-8 bg-white border-blue-200 text-gray-700 hover:bg-blue-50 transition-colors"
            aria-label="Выбрать стиль заголовка"
            title="Стиль текста"
          >
            <SelectValue placeholder="Стиль текста" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg">
            <SelectItem value="paragraph" className="text-gray-700 hover:bg-blue-50 cursor-pointer">
              Обычный текст
            </SelectItem>
            <SelectItem value="1" className="text-gray-700 hover:bg-blue-50 cursor-pointer">
              <span className="text-2xl font-bold">Заголовок 1</span>
            </SelectItem>
            <SelectItem value="2" className="text-gray-700 hover:bg-blue-50 cursor-pointer">
              <span className="text-xl font-bold">Заголовок 2</span>
            </SelectItem>
            <SelectItem value="3" className="text-gray-700 hover:bg-blue-50 cursor-pointer">
              <span className="text-lg font-bold">Заголовок 3</span>
            </SelectItem>
            <SelectItem value="4" className="text-gray-700 hover:bg-blue-50 cursor-pointer">
              <span className="text-base font-bold">Заголовок 4</span>
            </SelectItem>
            <SelectItem value="5" className="text-gray-700 hover:bg-blue-50 cursor-pointer">
              <span className="text-sm font-bold">Заголовок 5</span>
            </SelectItem>
            <SelectItem value="6" className="text-gray-700 hover:bg-blue-50 cursor-pointer">
              <span className="text-xs font-bold">Заголовок 6</span>
            </SelectItem>
          </SelectContent>
        </Select>

        <div className="w-px h-6 bg-gray-300 mx-2 self-center" />

        {/* Списки */}
        <Button
          type="button"
          variant={editor.isActive('bulletList') ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          onMouseEnter={() => announceButton('Маркированный список')}
          title="Маркированный список"
          aria-label="Создать маркированный список"
          className={`h-8 w-8 p-0 transition-all hover:scale-105 ${
            editor.isActive('bulletList') 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-white hover:bg-blue-600 hover:text-white border-gray-300 hover:border-blue-600'
          }`}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('orderedList') ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          onMouseEnter={() => announceButton('Нумерованный список')}
          title="Нумерованный список"
          aria-label="Создать нумерованный список"
          className={`h-8 w-8 p-0 transition-all hover:scale-105 ${
            editor.isActive('orderedList') 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-white hover:bg-blue-600 hover:text-white border-gray-300 hover:border-blue-600'
          }`}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-2 self-center" />

        {/* Цитата */}
        <Button
          type="button"
          variant={editor.isActive('blockquote') ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          onMouseEnter={() => announceButton('Цитата')}
          title="Цитата"
          aria-label="Оформить как цитату"
          className={`h-8 w-8 p-0 transition-all hover:scale-105 ${
            editor.isActive('blockquote') 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-white hover:bg-blue-600 hover:text-white border-gray-300 hover:border-blue-600'
          }`}
        >
          <Quote className="h-4 w-4" />
        </Button>

        {/* Разделитель */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          onMouseEnter={() => announceButton('Горизонтальная линия')}
          title="Горизонтальная линия"
          aria-label="Вставить горизонтальную линию"
          className="h-8 w-8 p-0 transition-all hover:scale-105 bg-white hover:bg-blue-600 hover:text-white border-gray-300 hover:border-blue-600"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-2 self-center" />

        {/* Выравнивание текста */}
        <Button
          type="button"
          variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          onMouseEnter={() => announceButton('Выровнять по левому краю')}
          title="Выровнять по левому краю"
          aria-label="Выровнять текст по левому краю"
          className={`h-8 w-8 p-0 transition-all hover:scale-105 ${
            editor.isActive({ textAlign: 'left' }) 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-white hover:bg-blue-600 hover:text-white border-gray-300 hover:border-blue-600'
          }`}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          onMouseEnter={() => announceButton('Выровнять по центру')}
          title="Выровнять по центру"
          aria-label="Выровнять текст по центру"
          className={`h-8 w-8 p-0 transition-all hover:scale-105 ${
            editor.isActive({ textAlign: 'center' }) 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-white hover:bg-blue-600 hover:text-white border-gray-300 hover:border-blue-600'
          }`}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          onMouseEnter={() => announceButton('Выровнять по правому краю')}
          title="Выровнять по правому краю"
          aria-label="Выровнять текст по правому краю"
          className={`h-8 w-8 p-0 transition-all hover:scale-105 ${
            editor.isActive({ textAlign: 'right' }) 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-white hover:bg-blue-600 hover:text-white border-gray-300 hover:border-blue-600'
          }`}
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-2 self-center" />

        {/* Ссылка */}
        <Button
          type="button"
          variant={editor.isActive('link') ? 'default' : 'outline'}
          size="sm"
          onClick={addLink}
          onMouseEnter={() => announceButton('Добавить ссылку')}
          title="Добавить ссылку"
          aria-label="Добавить или редактировать ссылку"
          className={`h-8 w-8 p-0 transition-all hover:scale-105 ${
            editor.isActive('link') 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-white hover:bg-blue-600 hover:text-white border-gray-300 hover:border-blue-600'
          }`}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        {/* Изображение */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onMouseEnter={() => announceButton('Добавить изображение')}
              title="Добавить изображение"
              aria-label="Вставить изображение"
              className="h-8 w-9 p-0 transition-all hover:scale-105 bg-white hover:bg-blue-600 hover:text-white border-gray-300 hover:border-blue-600"
              disabled={uploadingImage}
            >
              {uploadingImage ? (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ImageIcon className="h-4 w-4" />
                  <ChevronDown className="h-3 w-3 ml-0.5" />
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={addImageByUrl} className="cursor-pointer">
              <LinkIcon className="h-4 w-4 mr-2" />
              Вставить по URL
            </DropdownMenuItem>
            <DropdownMenuItem onClick={triggerImageUpload} className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Загрузить файл
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Таблица */}
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowTableSelector(!showTableSelector)}
            onMouseEnter={() => announceButton('Добавить таблицу')}
            title="Добавить таблицу"
            aria-label="Вставить таблицу"
            className="h-8 w-8 p-0 transition-all hover:scale-105 bg-white hover:bg-blue-600 hover:text-white border-gray-300 hover:border-blue-600"
          >
            <TableIcon className="h-4 w-4" />
          </Button>
          {showTableSelector && (
            <TableSizeSelector 
              onSelect={addTable} 
              onClose={() => setShowTableSelector(false)} 
            />
          )}
        </div>

        <div className="w-px h-6 bg-gray-300 mx-2 self-center" />

        {/* Цвета */}
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowColorPicker(!showColorPicker)}
            onMouseEnter={() => announceButton('Цвет текста')}
            title="Цвет текста"
            aria-label="Выбрать цвет текста"
            className="h-8 w-8 p-0 transition-all hover:scale-105 bg-white hover:bg-blue-600 hover:text-white border-gray-300 hover:border-blue-600"
          >
            <div className="w-4 h-4 border border-gray-400 bg-black rounded-sm" />
          </Button>
          {showColorPicker && (
            <ColorPalette
              colors={standardColors}
              onSelect={setColor}
              onClose={() => setShowColorPicker(false)}
              title="Цвет текста"
            />
          )}
        </div>
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowHighlightPicker(!showHighlightPicker)}
            onMouseEnter={() => announceButton('Выделение цветом')}
            title="Выделение цветом"
            aria-label="Выбрать цвет выделения"
            className="h-8 w-8 p-0 transition-all hover:scale-105 bg-white hover:bg-blue-600 hover:text-white border-gray-300 hover:border-blue-600"
          >
            <div className="w-4 h-4 border border-gray-400 bg-yellow-400 rounded-sm" />
          </Button>
          {showHighlightPicker && (
            <ColorPalette
              colors={standardColors}
              onSelect={setHighlight}
              onClose={() => setShowHighlightPicker(false)}
              title="Цвет выделения"
            />
          )}
        </div>

        <div className="w-px h-6 bg-gradient-to-b from-blue-200 to-blue-400 mx-2 self-center" />

        {/* История */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Отменить последнее действие"
          aria-label="Отменить"
          className={`h-8 w-8 p-0 transition-all hover:scale-105 ${
            !editor.can().undo() 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white hover:bg-blue-50 border-blue-200'
          }`}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Повторить последнее действие"
          aria-label="Повторить"
          className={`h-8 w-8 p-0 transition-all hover:scale-105 ${
            !editor.can().redo() 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white hover:bg-blue-50 border-blue-200'
          }`}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Компенсация высоты для sticky toolbar */}
      {isToolbarSticky && <div style={{ height: '56px' }} />}

      {/* Редактор */}
      <EditorContent 
        editor={editor} 
        className="tiptap-editor"
        style={{ 
          minHeight: height,
          marginTop: isToolbarSticky ? '0px' : '0px'
        }}
      />
      
      {/* Скрытый input для загрузки файлов */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <style>{`
        .tiptap-editor .ProseMirror {
          padding: 16px !important;
          min-height: ${height}px !important;
          font-size: 14px !important;
          line-height: 1.4 !important;
          outline: none !important;
        }
        
        .tiptap-editor p {
          line-height: 1.4 !important;
          margin: 0.5rem 0 !important;
        }
        
        .tiptap-editor .ProseMirror p.is-editor-empty:first-child::before {
          content: "${placeholder}";
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
        
        .tiptap-editor table {
          border-collapse: collapse !important;
          table-layout: fixed !important;
          width: 100% !important;
          margin: 1em 0 !important;
          overflow: hidden !important;
        }
        
        .tiptap-editor td,
        .tiptap-editor th {
          min-width: 1em !important;
          border: 1px solid #ddd !important;
          padding: 8px 12px !important;
          vertical-align: top !important;
          box-sizing: border-box !important;
          position: relative !important;
        }
        
        .tiptap-editor th {
          font-weight: 600 !important;
          text-align: left !important;
          background-color: #f9fafb !important;
        }
        
        .tiptap-editor img {
          max-width: 100% !important;
          height: auto !important;
          margin: 1em 0 !important;
          border-radius: 4px !important;
        }
        
        .tiptap-editor blockquote {
          padding-left: 1rem !important;
          border-left: 4px solid #e5e7eb !important;
          margin: 1.5rem 0 !important;
        }
        
        .tiptap-editor hr {
          margin: 2rem 0 !important;
          border: none !important;
          border-top: 1px solid #e5e7eb !important;
        }
        
        .tiptap-editor ul,
        .tiptap-editor ol {
          padding: 0 1rem !important;
          margin: 1rem 0 !important;
        }
        
        .tiptap-editor li {
          margin: 0.25rem 0 !important;
        }
        
        .tiptap-editor h1,
        .tiptap-editor h2,
        .tiptap-editor h3,
        .tiptap-editor h4,
        .tiptap-editor h5,
        .tiptap-editor h6 {
          margin: 1.5rem 0 1rem 0 !important;
          font-weight: 600 !important;
        }
        
        .tiptap-editor h1 { font-size: 2em !important; }
        .tiptap-editor h2 { font-size: 1.5em !important; }
        .tiptap-editor h3 { font-size: 1.25em !important; }
        .tiptap-editor h4 { font-size: 1.1em !important; }
        .tiptap-editor h5 { font-size: 1em !important; }
        .tiptap-editor h6 { font-size: 0.9em !important; }
        
        .tiptap-editor a {
          color: #3b82f6 !important;
          text-decoration: underline !important;
        }
        
        .tiptap-editor code {
          background-color: #f3f4f6 !important;
          padding: 2px 4px !important;
          border-radius: 3px !important;
          font-family: 'Courier New', Courier, monospace !important;
        }
      `}</style>
    </div>
  );
}