import { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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

  // Конфигурация модулей Quill
  const modules = {
    toolbar: [
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
    ],
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

  return (
    <div className="quill-editor-container">
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
          border-top: 1px solid hsl(var(--border));
          border-left: 1px solid hsl(var(--border));
          border-right: 1px solid hsl(var(--border));
          border-bottom: none;
          background: hsl(var(--muted));
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
        }
        
        .quill-editor-container .ql-editor table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        }
        
        .quill-editor-container .ql-editor table td,
        .quill-editor-container .ql-editor table th {
          border: 1px solid hsl(var(--border));
          padding: 8px 12px;
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
        }
        
        .quill-editor-container .ql-editor table th {
          background-color: hsl(var(--muted));
          font-weight: 600;
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