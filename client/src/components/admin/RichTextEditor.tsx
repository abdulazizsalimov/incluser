import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

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
  const editorRef = useRef(null);

  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  return (
    <div className="w-full">
      <Editor
        apiKey="no-api-key"
        onInit={(evt: any, editor: any) => editorRef.current = editor}
        value={value}
        onEditorChange={handleEditorChange}
        init={{
          height: height,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
            'emoticons', 'template', 'paste', 'textcolor', 'colorpicker'
          ],
          toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat | code fullscreen preview',
          table_toolbar: 'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
          table_resize_bars: true,
          table_grid: true,
          table_tab_navigation: true,
          table_default_attributes: {
            border: '1'
          },
          table_default_styles: {
            'border-collapse': 'collapse',
            'width': '100%'
          },
          content_style: `
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              font-size: 14px; 
              line-height: 1.6;
              color: #333;
              background-color: #fff;
            }
            table {
              border-collapse: collapse;
              border: 1px solid #ddd;
              width: 100%;
              margin: 1em 0;
            }
            table td, table th {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            table th {
              background-color: #f2f2f2;
              font-weight: bold;
            }
            img {
              max-width: 100%;
              height: auto;
            }
          `,
          placeholder: placeholder,
          branding: false,
          promotion: false,
          skin: 'oxide',
          content_css: 'default',
          directionality: 'ltr',
          language: 'ru',
          paste_data_images: true,
          images_upload_handler: (blobInfo: any, success: any, failure: any, progress: any) => {
            // Обработка загрузки изображений через drag&drop или paste
            const formData = new FormData();
            formData.append('image', blobInfo.blob(), blobInfo.filename());
            
            fetch('/api/admin/upload-image', {
              method: 'POST',
              body: formData,
            })
            .then(response => response.json())
            .then(result => {
              if (result.url) {
                success(result.url);
              } else {
                failure('Ошибка загрузки изображения');
              }
            })
            .catch(() => {
              failure('Ошибка загрузки изображения');
            });
          },
          setup: (editor: any) => {
            // Дополнительные настройки редактора
            editor.on('init', () => {
              console.log('TinyMCE editor initialized');
            });
          }
        }}
      />
    </div>
  );
}