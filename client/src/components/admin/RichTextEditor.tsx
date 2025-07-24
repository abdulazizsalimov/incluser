import { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, Image, Upload } from 'lucide-react';

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
  height = 400 
}: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Конфигурация модулей Quill
  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['blockquote', 'code-block'],
        ['clean']
      ]
    },
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: false
    }
  };

  // Форматы, которые поддерживает редактор
  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet',
    'indent',
    'direction', 'align',
    'link', 'image', 'video',
    'blockquote', 'code-block'
  ];

  const handleChange = (content: string) => {
    onChange(content);
  };

  // Добавляем интерактивность после монтирования компонента
  useEffect(() => {
    const initializeInteractivity = () => {
      const quill = quillRef.current?.getEditor();
      if (!quill) return;

      const editorElement = quill.root;

      // Обработка изменения размера изображений
      const handleImageResize = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        const target = e.target as HTMLElement;
        if (!target.closest('.image-resize-handle')) return;
        
        const img = target.parentElement?.querySelector('img') as HTMLImageElement;
        if (!img) return;

        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = img.offsetWidth;
        const startHeight = img.offsetHeight;
        const aspectRatio = startWidth / startHeight;

        const onMouseMove = (e: MouseEvent) => {
          const deltaX = e.clientX - startX;
          const newWidth = Math.max(50, startWidth + deltaX);
          const newHeight = newWidth / aspectRatio;
          
          img.style.width = `${newWidth}px`;
          img.style.height = `${newHeight}px`;
        };

        const onMouseUp = () => {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          document.body.style.cursor = '';
          document.body.style.userSelect = '';
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.body.style.cursor = 'nw-resize';
        document.body.style.userSelect = 'none';
      };

      // Обработка изменения размера столбцов таблицы
      const handleColumnResize = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        
        // Проверяем, что клик по границе ячейки (правая часть)
        const cell = target.closest('td, th') as HTMLTableCellElement;
        if (!cell) return;
        
        const rect = cell.getBoundingClientRect();
        const isRightEdge = e.clientX > rect.right - 8; // 8px зона для изменения размера
        
        if (!isRightEdge || cell.parentElement?.lastElementChild === cell) return;
        
        e.preventDefault();
        e.stopPropagation();

        const table = cell.closest('table') as HTMLTableElement;
        if (!table) return;

        const startX = e.clientX;
        const startWidth = cell.offsetWidth;
        const columnIndex = Array.from(cell.parentElement!.children).indexOf(cell);

        const onMouseMove = (e: MouseEvent) => {
          const deltaX = e.clientX - startX;
          const newWidth = Math.max(50, startWidth + deltaX);
          
          // Применяем новую ширину ко всем ячейкам в столбце
          const rows = table.querySelectorAll('tr');
          rows.forEach(row => {
            const cellInColumn = row.children[columnIndex] as HTMLTableCellElement;
            if (cellInColumn) {
              cellInColumn.style.width = `${newWidth}px`;
              cellInColumn.style.minWidth = `${newWidth}px`;
            }
          });
        };

        const onMouseUp = () => {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          document.body.style.cursor = '';
          document.body.style.userSelect = '';
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
      };

      // Добавление кнопок изменения размера к изображениям
      const addImageResizeHandles = () => {
        const images = editorElement.querySelectorAll('img');
        images.forEach(img => {
          if (img.parentElement?.querySelector('.image-resize-handle')) return;

          const wrapper = document.createElement('div');
          wrapper.style.position = 'relative';
          wrapper.style.display = 'inline-block';
          wrapper.style.maxWidth = '100%';
          
          img.parentNode?.insertBefore(wrapper, img);
          wrapper.appendChild(img);

          const handle = document.createElement('div');
          handle.className = 'image-resize-handle bottom-right';
          handle.style.display = 'none';
          wrapper.appendChild(handle);

          wrapper.addEventListener('mouseenter', () => {
            handle.style.display = 'block';
            img.classList.add('selected');
          });

          wrapper.addEventListener('mouseleave', () => {
            handle.style.display = 'none';
            img.classList.remove('selected');
          });

          handle.addEventListener('mousedown', handleImageResize);
        });
      };

      // Обработчики для изменения размера столбцов
      editorElement.addEventListener('mousedown', handleColumnResize);
      
      // Обработчик наведения для изменения курсора
      editorElement.addEventListener('mousemove', (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const cell = target.closest('td, th') as HTMLTableCellElement;
        
        if (cell && cell.parentElement?.lastElementChild !== cell) {
          const rect = cell.getBoundingClientRect();
          const isRightEdge = e.clientX > rect.right - 8;
          
          if (isRightEdge) {
            editorElement.style.cursor = 'col-resize';
          } else {
            editorElement.style.cursor = '';
          }
        } else {
          editorElement.style.cursor = '';
        }
      });

      // Наблюдатель за изменениями в редакторе для добавления кнопок к новым изображениям
      const observer = new MutationObserver(() => {
        addImageResizeHandles();
      });

      observer.observe(editorElement, {
        childList: true,
        subtree: true
      });

      // Инициализация для существующих изображений
      addImageResizeHandles();

      return () => {
        observer.disconnect();
        editorElement.removeEventListener('mousedown', handleColumnResize);
        editorElement.removeEventListener('mousemove', () => {});
      };
    };

    // Задержка для инициализации после полной загрузки Quill
    const timer = setTimeout(initializeInteractivity, 100);
    return () => clearTimeout(timer);
  }, []);

  // Функция вставки настоящей HTML таблицы
  const insertTable = () => {
    console.log('insertTable called with rows:', tableRows, 'cols:', tableCols);
    
    const quill = quillRef.current?.getEditor();
    if (!quill) {
      console.log('No quill editor found');
      return;
    }

    // Получаем текущую позицию курсора
    let range = quill.getSelection(true); // true = focus first
    console.log('Current selection:', range);
    
    if (!range) {
      // Фокусируемся на редакторе и получаем позицию
      quill.focus();
      const newRange = quill.getSelection();
      if (!newRange) {
        console.log('Could not get selection');
        return;
      }
      range = newRange;
    }

    // Создаем HTML для настоящей таблицы
    let tableHTML = '<table style="border-collapse: collapse; width: 100%; margin: 1em 0; border: 1px solid #ccc;">';
    
    for (let i = 0; i < tableRows; i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < tableCols; j++) {
        const cellTag = i === 0 ? 'th' : 'td';
        const cellContent = i === 0 ? `Заголовок ${j + 1}` : `Ячейка ${i + 1},${j + 1}`;
        const cellStyle = 'border: 1px solid #ccc; padding: 8px; ' + 
                         (i === 0 ? 'background-color: #f5f5f5; font-weight: bold;' : 'background-color: white;');
        tableHTML += `<${cellTag} style="${cellStyle}">${cellContent}</${cellTag}>`;
      }
      tableHTML += '</tr>';
    }
    tableHTML += '</table>';

    console.log('Inserting table HTML at position:', range.index);
    console.log('Table HTML:', tableHTML);

    // Вставляем перед таблицей пустую строку если курсор не в начале строки
    if (range.index > 0) {
      const beforeChar = quill.getText(range.index - 1, 1);
      if (beforeChar !== '\n') {
        quill.insertText(range.index, '\n', 'user');
        range.index += 1;
      }
    }

    // Вставляем HTML таблицу прямо в позицию курсора
    quill.clipboard.dangerouslyPasteHTML(range.index, tableHTML);

    // Перемещаем курсор после таблицы
    setTimeout(() => {
      const newLength = quill.getLength();
      quill.insertText(newLength - 1, '\n', 'user');
      quill.setSelection(newLength);
    }, 100);
    
    setTableDialogOpen(false);
    console.log('Table insertion completed');
  };

  // Функция вставки изображения
  const insertImage = () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    let range = quill.getSelection();
    if (!range) {
      // Если нет выделения, устанавливаем курсор в конец
      quill.setSelection(quill.getLength());
      range = quill.getSelection();
      if (!range) return;
    }

    if (imageUrl.trim()) {
      // Вставляем изображение в текущую позицию курсора
      quill.insertEmbed(range.index, 'image', imageUrl);
      
      // Устанавливаем альтернативный текст если указан
      if (imageAlt.trim()) {
        const imgElement = quill.root.querySelector(`img[src="${imageUrl}"]`);
        if (imgElement) {
          imgElement.setAttribute('alt', imageAlt);
        }
      }
      
      // Добавляем перенос строки после изображения
      quill.setSelection(range.index + 1);
      quill.insertText(range.index + 1, '\n');
      
      // Очищаем поля и закрываем диалог
      setImageUrl('');
      setImageAlt('');
      setImageDialogOpen(false);
    }
  };

  // Функция загрузки изображения
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5MB');
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки изображения');
      }

      const result = await response.json();
      setImageUrl(result.path);
      setImageAlt(file.name.replace(/\.[^/.]+$/, ""));
      
      // Очищаем input файла для возможности повторной загрузки того же файла
      (event.target as HTMLInputElement).value = '';
    } catch (error) {
      console.error('Upload error:', error);
      alert('Ошибка загрузки изображения');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="quill-editor-container relative">
      {/* Дополнительная панель инструментов для вставки */}
      <div className="insert-toolbar border border-border bg-muted/50 p-2 flex items-center gap-2 rounded-t-md">
        <span className="text-sm font-medium text-muted-foreground">Вставка:</span>
        
        {/* Кнопка вставки таблицы */}
        <Dialog open={tableDialogOpen} onOpenChange={setTableDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              Таблица
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Вставить таблицу</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rows">Строки</Label>
                  <Input
                    id="rows"
                    type="number"
                    value={tableRows}
                    onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
                    min="1"
                    max="20"
                  />
                </div>
                <div>
                  <Label htmlFor="cols">Столбцы</Label>
                  <Input
                    id="cols"
                    type="number"
                    value={tableCols}
                    onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
                    min="1"
                    max="10"
                  />
                </div>
              </div>
              <Button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  insertTable();
                }}
              >
                Вставить таблицу
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Кнопка вставки изображения */}
        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Изображение
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Вставить изображение</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="imageUpload">Загрузить файл</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                  {uploadingImage && <span className="text-sm text-muted-foreground">Загрузка...</span>}
                </div>
              </div>
              <div>
                <Label htmlFor="imageUrl">Или введите URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label htmlFor="imageAlt">Альтернативный текст</Label>
                <Input
                  id="imageAlt"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Описание изображения"
                />
              </div>
              <Button onClick={insertImage} disabled={!imageUrl.trim()}>
                Вставить изображение
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <style>{`
        .quill-editor-container .ql-editor {
          min-height: ${height - 100}px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          line-height: 1.6;
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
        }
        
        .quill-editor-container .ql-toolbar {
          border-top: none;
          border-left: 1px solid hsl(var(--border));
          border-right: 1px solid hsl(var(--border));
          border-bottom: none;
          background: hsl(var(--muted));
          position: sticky;
          top: 0;
          z-index: 10;
          backdrop-filter: blur(8px);
        }
        
        .quill-editor-container .ql-toolbar .ql-stroke {
          stroke: hsl(var(--foreground));
        }
        
        .quill-editor-container .ql-toolbar .ql-fill {
          fill: hsl(var(--foreground));
        }
        
        .quill-editor-container .ql-toolbar button:hover {
          background-color: hsl(var(--accent));
        }
        
        .quill-editor-container .ql-toolbar button.ql-active {
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }
        
        .quill-editor-container .ql-container {
          border-left: 1px solid hsl(var(--border));
          border-right: 1px solid hsl(var(--border));
          border-bottom: 1px solid hsl(var(--border));
          border-top: none;
          font-size: 14px;
          background-color: hsl(var(--background));
        }
        
        .quill-editor-container .ql-editor.ql-blank::before {
          color: hsl(var(--muted-foreground));
          font-style: normal;
          left: 15px;
        }
        
        .quill-editor-container .ql-editor p {
          margin-bottom: 1em;
          color: hsl(var(--foreground));
        }
        
        .quill-editor-container .ql-editor h1,
        .quill-editor-container .ql-editor h2,
        .quill-editor-container .ql-editor h3,
        .quill-editor-container .ql-editor h4,
        .quill-editor-container .ql-editor h5,
        .quill-editor-container .ql-editor h6 {
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          font-weight: 600;
          color: hsl(var(--foreground));
        }
        
        .quill-editor-container .ql-editor blockquote {
          border-left: 4px solid hsl(var(--primary));
          padding-left: 16px;
          margin-left: 0;
          margin-right: 0;
          font-style: italic;
          color: hsl(var(--muted-foreground));
        }
        
        .quill-editor-container .ql-editor ul,
        .quill-editor-container .ql-editor ol {
          padding-left: 1.5em;
        }
        
        .quill-editor-container .ql-editor li {
          margin-bottom: 0.5em;
          color: hsl(var(--foreground));
        }
        
        .quill-editor-container .ql-editor img {
          max-width: 100%;
          height: auto;
          cursor: pointer;
          border: 2px solid transparent;
          transition: border-color 0.2s;
          position: relative;
        }
        
        .quill-editor-container .ql-editor img:hover {
          border-color: hsl(var(--primary));
        }
        
        .quill-editor-container .ql-editor img.selected {
          border-color: hsl(var(--primary));
          outline: 2px solid hsl(var(--primary));
          outline-offset: 2px;
        }
        
        .image-resize-handle {
          position: absolute;
          width: 10px;
          height: 10px;
          background: hsl(var(--primary));
          border: 2px solid white;
          border-radius: 50%;
          cursor: nw-resize;
          z-index: 10;
        }
        
        .image-resize-handle.bottom-right {
          bottom: -5px;
          right: -5px;
        }
        
        .quill-editor-container .ql-editor table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
          position: relative;
        }
        
        .quill-editor-container .ql-editor table td,
        .quill-editor-container .ql-editor table th {
          border: 1px solid hsl(var(--border));
          padding: 8px 12px;
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
          position: relative;
          min-width: 50px;
        }
        
        .quill-editor-container .ql-editor table th {
          background-color: hsl(var(--muted));
          font-weight: 600;
        }
        
        /* Границы столбцов для изменения размера */
        .quill-editor-container .ql-editor table td:not(:last-child):after,
        .quill-editor-container .ql-editor table th:not(:last-child):after {
          content: '';
          position: absolute;
          top: 0;
          right: -2px;
          width: 4px;
          height: 100%;
          cursor: col-resize;
          background: transparent;
          z-index: 5;
        }
        
        .quill-editor-container .ql-editor table td:not(:last-child):hover:after,
        .quill-editor-container .ql-editor table th:not(:last-child):hover:after {
          background: hsl(var(--primary) / 0.3);
        }
        
        /* Выделение выбранной ячейки */
        .quill-editor-container .ql-editor table td.selected,
        .quill-editor-container .ql-editor table th.selected {
          background-color: hsl(var(--primary) / 0.1);
          outline: 2px solid hsl(var(--primary));
        }
        
        .quill-editor-container .ql-picker {
          color: hsl(var(--foreground));
        }
        
        .quill-editor-container .ql-picker-options {
          background-color: hsl(var(--background));
          border: 1px solid hsl(var(--border));
        }
        
        .quill-editor-container .ql-picker-item {
          color: hsl(var(--foreground));
        }
        
        .quill-editor-container .ql-picker-item:hover {
          background-color: hsl(var(--accent));
        }
        
        .quill-editor-container .ql-editor a {
          color: hsl(var(--primary));
        }
        
        .quill-editor-container .ql-editor code {
          background-color: hsl(var(--muted));
          color: hsl(var(--foreground));
          padding: 2px 4px;
          border-radius: 3px;
        }
        
        .quill-editor-container .ql-editor pre {
          background-color: hsl(var(--muted));
          color: hsl(var(--foreground));
          padding: 12px;
          border-radius: 6px;
          border: 1px solid hsl(var(--border));
        }
      `}</style>
      
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
}