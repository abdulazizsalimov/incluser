import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';

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
  const editorRef = useRef<any>(null);

  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  return (
    <Editor
      apiKey="no-api-key" // Используем в режиме разработки без API ключа
      onInit={(evt: any, editor: any) => editorRef.current = editor}
      value={value}
      onEditorChange={handleEditorChange}
      init={{
        height: height,
        menubar: false,
        language: 'ru',
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | table | link image | code | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        placeholder: placeholder,
        branding: false,
        promotion: false,
        setup: (editor: any) => {
          editor.on('init', () => {
            // Настройка стилей для доступности
            editor.dom.setStyle(editor.getBody(), 'color', '#374151');
            editor.dom.setStyle(editor.getBody(), 'background-color', '#ffffff');
          });
        },
        // Настройки для изображений
        image_advtab: true,
        image_caption: true,
        image_title: true,
        automatic_uploads: false,
        file_picker_types: 'image',
        images_upload_handler: (blobInfo: any, success: any, failure: any) => {
          // Простая реализация - конвертируем в base64
          const reader = new FileReader();
          reader.onload = function() {
            success(reader.result as string);
          };
          reader.readAsDataURL(blobInfo.blob());
        },
        // Настройки таблиц
        table_responsive_width: true,
        table_default_attributes: {
          'class': 'table table-bordered'
        },
        table_default_styles: {
          'border-collapse': 'collapse',
          'width': '100%'
        },
        // Настройки списков
        lists_indent_on_tab: true,
        // Настройки для доступности
        accessibility_focus: true,
        accessibility_warnings: true,
        // Валидация контента
        valid_elements: '*[*]',
        extended_valid_elements: 'script[src],iframe[src|width|height|frameborder|allowfullscreen]',
        // Настройки ссылок
        link_assume_external_targets: true,
        link_context_toolbar: true,
        // Автосохранение
        autosave_ask_before_unload: false,
        autosave_interval: '30s',
        autosave_prefix: 'tinymce-autosave-{path}{query}-{id}-',
        autosave_restore_when_empty: false,
        autosave_retention: '2m',
      }}
    />
  );
}