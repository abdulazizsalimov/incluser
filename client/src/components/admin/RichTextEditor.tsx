import { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Table,
  Image,
  Link,
  Quote,
  Type,
  Palette
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
  const editorRef = useRef<HTMLDivElement>(null);
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const insertTable = () => {
    let tableHTML = '<table style="border-collapse: collapse; width: 100%; margin: 1em 0; border: 1px solid #ddd;">';
    
    for (let i = 0; i < tableRows; i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < tableCols; j++) {
        const cellTag = i === 0 ? 'th' : 'td';
        const cellContent = i === 0 ? `Заголовок ${j + 1}` : `Ячейка ${i + 1},${j + 1}`;
        const cellStyle = `border: 1px solid #ddd; padding: 12px; text-align: left; ${i === 0 ? 'background-color: #f8f9fa; font-weight: 600;' : 'background-color: white;'}`;
        tableHTML += `<${cellTag} style="${cellStyle}">${cellContent}</${cellTag}>`;
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</table><p><br></p>';

    document.execCommand('insertHTML', false, tableHTML);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    setTableDialogOpen(false);
  };

  const insertLink = () => {
    const linkHTML = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
    document.execCommand('insertHTML', false, linkHTML);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    setLinkDialogOpen(false);
    setLinkText('');
    setLinkUrl('');
  };

  const insertImage = () => {
    const imageHTML = `<img src="${imageUrl}" alt="${imageAlt}" style="max-width: 100%; height: auto; margin: 1em 0;" />`;
    document.execCommand('insertHTML', false, imageHTML);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    setImageDialogOpen(false);
    setImageUrl('');
    setImageAlt('');
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div className="w-full border rounded-lg">
      {/* Панель инструментов */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50 dark:bg-gray-800">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('bold')}
          title="Жирный (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('italic')}
          title="Курсив (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('underline')}
          title="Подчёркивание (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('insertUnorderedList')}
          title="Маркированный список"
        >
          <List className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('insertOrderedList')}
          title="Нумерованный список"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('justifyLeft')}
          title="По левому краю"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('justifyCenter')}
          title="По центру"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('justifyRight')}
          title="По правому краю"
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <select 
          className="px-2 py-1 text-sm border rounded"
          onChange={(e) => execCommand('formatBlock', e.target.value)}
          defaultValue=""
        >
          <option value="">Обычный текст</option>
          <option value="h1">Заголовок 1</option>
          <option value="h2">Заголовок 2</option>
          <option value="h3">Заголовок 3</option>
          <option value="h4">Заголовок 4</option>
          <option value="p">Абзац</option>
        </select>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Dialog open={tableDialogOpen} onOpenChange={setTableDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" title="Вставить таблицу">
              <Table className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Вставить таблицу</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rows">Строки:</Label>
                <Input
                  id="rows"
                  type="number"
                  min="1"
                  max="20"
                  value={tableRows}
                  onChange={(e) => setTableRows(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="cols">Столбцы:</Label>
                <Input
                  id="cols"
                  type="number"
                  min="1"
                  max="10"
                  value={tableCols}
                  onChange={(e) => setTableCols(Number(e.target.value))}
                />
              </div>
            </div>
            <Button onClick={insertTable} className="mt-4">
              Вставить таблицу
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" title="Вставить ссылку">
              <Link className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Вставить ссылку</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="linkText">Текст ссылки:</Label>
                <Input
                  id="linkText"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Текст ссылки"
                />
              </div>
              <div>
                <Label htmlFor="linkUrl">URL:</Label>
                <Input
                  id="linkUrl"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <Button onClick={insertLink} className="mt-4">
              Вставить ссылку
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" title="Вставить изображение">
              <Image className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Вставить изображение</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="imageUrl">URL изображения:</Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label htmlFor="imageAlt">Альтернативный текст:</Label>
                <Input
                  id="imageAlt"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Описание изображения"
                />
              </div>
            </div>
            <Button onClick={insertImage} className="mt-4">
              Вставить изображение
            </Button>
          </DialogContent>
        </Dialog>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => execCommand('formatBlock', 'blockquote')}
          title="Цитата"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <input
          type="color"
          className="w-8 h-8 border rounded cursor-pointer"
          onChange={(e) => execCommand('foreColor', e.target.value)}
          title="Цвет текста"
        />
      </div>

      {/* Редактор */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        style={{ 
          minHeight: height,
          maxHeight: height * 2,
          overflowY: 'auto'
        }}
        className="p-4 focus:outline-none prose prose-sm max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: value || `<p>${placeholder}</p>` }}
        suppressContentEditableWarning={true}
      />
    </div>
  );
}