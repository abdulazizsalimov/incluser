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
import { Button } from '@/components/ui/button';
import { 
  Bold, Italic, Underline, Strikethrough, Code, List, ListOrdered,
  Undo, Redo, Quote, Minus, Table as TableIcon, Link as LinkIcon,
  Image as ImageIcon, Palette, Highlighter, AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Начните вводить содержание статьи...",
  height = 500 
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Highlight,
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

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = prompt('Введите URL ссылки:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = prompt('Введите URL изображения:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const setColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  const setHighlight = (color: string) => {
    editor.chain().focus().setHighlight({ color }).run();
  };

  return (
    <div className="w-full border rounded-lg overflow-hidden bg-white">
      {/* Панель инструментов */}
      <div className="border-b p-3 bg-gray-50 flex flex-wrap gap-1">
        {/* Форматирование текста */}
        <Button
          type="button"
          variant={editor.isActive('bold') ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Жирный"
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('italic') ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Курсив"
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('underline') ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Подчёркнутый"
          className="h-8 w-8 p-0"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('strike') ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Зачёркнутый"
          className="h-8 w-8 p-0"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('code') ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          title="Код"
          className="h-8 w-8 p-0"
        >
          <Code className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-2 self-center" />

        {/* Заголовки */}
        <select 
          onChange={(e) => {
            if (e.target.value === 'paragraph') {
              editor.chain().focus().setParagraph().run();
            } else {
              editor.chain().focus().toggleHeading({ level: parseInt(e.target.value) as any }).run();
            }
          }}
          className="px-2 py-1 border rounded text-sm"
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
        >
          <option value="paragraph">Обычный текст</option>
          <option value="1">Заголовок 1</option>
          <option value="2">Заголовок 2</option>
          <option value="3">Заголовок 3</option>
          <option value="4">Заголовок 4</option>
          <option value="5">Заголовок 5</option>
          <option value="6">Заголовок 6</option>
        </select>

        <div className="w-px h-6 bg-gray-300 mx-2 self-center" />

        {/* Списки */}
        <Button
          type="button"
          variant={editor.isActive('bulletList') ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Маркированный список"
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('orderedList') ? 'default' : 'outline'}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Нумерованный список"
          className="h-8 w-8 p-0"
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
          title="Цитата"
          className="h-8 w-8 p-0"
        >
          <Quote className="h-4 w-4" />
        </Button>

        {/* Разделитель */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Горизонтальная линия"
          className="h-8 w-8 p-0"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-2 self-center" />

        {/* Ссылка */}
        <Button
          type="button"
          variant={editor.isActive('link') ? 'default' : 'outline'}
          size="sm"
          onClick={addLink}
          title="Добавить ссылку"
          className="h-8 w-8 p-0"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        {/* Изображение */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addImage}
          title="Добавить изображение"
          className="h-8 w-8 p-0"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>

        {/* Таблица */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addTable}
          title="Добавить таблицу"
          className="h-8 w-8 p-0"
        >
          <TableIcon className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-2 self-center" />

        {/* Цвета */}
        <input
          type="color"
          onChange={(e) => setColor(e.target.value)}
          title="Цвет текста"
          className="w-8 h-8 border rounded cursor-pointer"
        />
        <input
          type="color"
          onChange={(e) => setHighlight(e.target.value)}
          title="Выделение цветом"
          className="w-8 h-8 border rounded cursor-pointer"
        />

        <div className="w-px h-6 bg-gray-300 mx-2 self-center" />

        {/* История */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Отменить"
          className="h-8 w-8 p-0"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Повторить"
          className="h-8 w-8 p-0"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Редактор */}
      <EditorContent 
        editor={editor} 
        className="tiptap-editor"
        style={{ minHeight: height }}
      />
      
      <style>{`
        .tiptap-editor .ProseMirror {
          padding: 16px !important;
          min-height: ${height}px !important;
          font-size: 14px !important;
          line-height: 1.6 !important;
          outline: none !important;
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