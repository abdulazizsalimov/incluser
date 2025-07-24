import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight, Link, Image, Table } from 'lucide-react';

interface SimpleHTMLEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
}

export default function SimpleHTMLEditor({ 
  value, 
  onChange, 
  placeholder = "Начните вводить содержание статьи...",
  height = 500 
}: SimpleHTMLEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const insertTable = () => {
    const rows = prompt('Количество строк:', '3');
    const cols = prompt('Количество столбцов:', '3');
    
    if (rows && cols) {
      const rowCount = parseInt(rows);
      const colCount = parseInt(cols);
      
      let tableHTML = '<table style="border-collapse: collapse; width: 100%; margin: 1em 0; border: 1px solid #ddd;">';
      
      // Заголовок
      tableHTML += '<thead><tr>';
      for (let j = 0; j < colCount; j++) {
        tableHTML += '<th style="border: 1px solid #ddd; padding: 8px 12px; background-color: #f9fafb; font-weight: 600; text-align: left;">Заголовок ' + (j + 1) + '</th>';
      }
      tableHTML += '</tr></thead>';
      
      // Строки данных
      tableHTML += '<tbody>';
      for (let i = 0; i < rowCount; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < colCount; j++) {
          tableHTML += '<td style="border: 1px solid #ddd; padding: 8px 12px;">Ячейка ' + (i + 1) + '-' + (j + 1) + '</td>';
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</tbody></table><p><br></p>';
      
      document.execCommand('insertHTML', false, tableHTML);
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }
  };

  const insertLink = () => {
    const url = prompt('Введите URL ссылки:');
    if (url) {
      const text = prompt('Введите текст ссылки:', url);
      const linkHTML = `<a href="${url}" target="_blank" rel="noopener noreferrer">${text || url}</a>`;
      document.execCommand('insertHTML', false, linkHTML);
    }
  };

  const insertImage = () => {
    const url = prompt('Введите URL изображения:');
    if (url) {
      const alt = prompt('Введите описание изображения:');
      const imgHTML = `<img src="${url}" alt="${alt || ''}" style="max-width: 100%; height: auto; margin: 1em 0;" />`;
      document.execCommand('insertHTML', false, imgHTML);
    }
  };

  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'Жирный' },
    { icon: Italic, command: 'italic', title: 'Курсив' },
    { icon: Underline, command: 'underline', title: 'Подчёркнутый' },
    { icon: List, command: 'insertUnorderedList', title: 'Маркированный список' },
    { icon: AlignLeft, command: 'justifyLeft', title: 'По левому краю' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'По центру' },
    { icon: AlignRight, command: 'justifyRight', title: 'По правому краю' },
  ];

  return (
    <div className="w-full border rounded-lg overflow-hidden bg-white">
      {/* Панель инструментов */}
      <div className="border-b p-3 bg-gray-50 flex flex-wrap gap-1">
        {toolbarButtons.map((btn, index) => (
          <Button
            key={index}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => execCommand(btn.command)}
            title={btn.title}
            className="h-8 w-8 p-0"
          >
            <btn.icon className="h-4 w-4" />
          </Button>
        ))}
        
        <div className="w-px h-6 bg-gray-300 mx-2 self-center" />
        
        <select 
          onChange={(e) => execCommand('formatBlock', e.target.value)}
          className="px-2 py-1 border rounded text-sm"
          defaultValue=""
        >
          <option value="">Стиль</option>
          <option value="h1">Заголовок 1</option>
          <option value="h2">Заголовок 2</option>
          <option value="h3">Заголовок 3</option>
          <option value="h4">Заголовок 4</option>
          <option value="p">Обычный текст</option>
        </select>
        
        <div className="w-px h-6 bg-gray-300 mx-2 self-center" />
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={insertLink}
          title="Добавить ссылку"
          className="h-8 w-8 p-0"
        >
          <Link className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={insertImage}
          title="Добавить изображение"
          className="h-8 w-8 p-0"
        >
          <Image className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={insertTable}
          title="Добавить таблицу"
          className="h-8 w-8 p-0"
        >
          <Table className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-2 self-center" />
        
        <input
          type="color"
          onChange={(e) => execCommand('foreColor', e.target.value)}
          title="Цвет текста"
          className="w-8 h-8 border rounded cursor-pointer"
        />
        
        <input
          type="color"
          onChange={(e) => execCommand('hiliteColor', e.target.value)}
          title="Цвет фона"
          className="w-8 h-8 border rounded cursor-pointer"
        />
      </div>

      {/* Редактор */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 prose max-w-none focus:outline-none"
        style={{ 
          minHeight: height,
          fontSize: '14px',
          lineHeight: '1.6'
        }}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      />
      
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          font-style: italic;
          pointer-events: none;
        }
        
        [contenteditable] table {
          border-collapse: collapse !important;
          border: 1px solid #d1d5db !important;
          width: 100% !important;
          margin: 1em 0 !important;
        }
        
        [contenteditable] table td,
        [contenteditable] table th {
          border: 1px solid #d1d5db !important;
          padding: 8px 12px !important;
          text-align: left !important;
        }
        
        [contenteditable] table th {
          background-color: #f9fafb !important;
          font-weight: 600 !important;
        }
        
        [contenteditable] img {
          max-width: 100% !important;
          height: auto !important;
          margin: 1em 0 !important;
        }
        
        [contenteditable] ul,
        [contenteditable] ol {
          margin: 1em 0 !important;
          padding-left: 2em !important;
        }
        
        [contenteditable] h1,
        [contenteditable] h2,
        [contenteditable] h3,
        [contenteditable] h4 {
          margin: 1em 0 0.5em 0 !important;
          font-weight: 600 !important;
        }
        
        [contenteditable] h1 { font-size: 2em !important; }
        [contenteditable] h2 { font-size: 1.5em !important; }
        [contenteditable] h3 { font-size: 1.25em !important; }
        [contenteditable] h4 { font-size: 1.1em !important; }
        
        [contenteditable] p {
          margin: 0.5em 0 !important;
        }
        
        [contenteditable] a {
          color: #3b82f6 !important;
          text-decoration: underline !important;
        }
        
        [contenteditable]:focus {
          outline: none !important;
        }
      `}</style>
    </div>
  );
}