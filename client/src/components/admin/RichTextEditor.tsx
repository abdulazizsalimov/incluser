import { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

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
  const [editorState, setEditorState] = useState(() => {
    if (value) {
      const contentBlock = htmlToDraft(value);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        return EditorState.createWithContent(contentState);
      }
    }
    return EditorState.createEmpty();
  });

  const onEditorStateChange = (state: EditorState) => {
    setEditorState(state);
    const htmlContent = draftToHtml(convertToRaw(state.getCurrentContent()));
    onChange(htmlContent);
  };

  // Конфигурация панели инструментов
  const toolbarConfig = {
    options: [
      'inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 
      'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'
    ],
    inline: {
      inDropdown: false,
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
      options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace', 'superscript', 'subscript'],
    },
    blockType: {
      inDropdown: true,
      options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
    },
    fontSize: {
      icon: undefined,
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
      options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
    },
    fontFamily: {
      options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
    },
    list: {
      inDropdown: false,
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
      options: ['unordered', 'ordered', 'indent', 'outdent'],
    },
    textAlign: {
      inDropdown: false,
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
      options: ['left', 'center', 'right', 'justify'],
    },
    colorPicker: {
      icon: undefined,
      className: undefined,
      component: undefined,
      popupClassName: undefined,
      colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
        'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
        'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
        'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
        'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
        'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
    },
    link: {
      inDropdown: false,
      className: undefined,
      component: undefined,
      popupClassName: undefined,
      dropdownClassName: undefined,
      showOpenOptionOnHover: true,
      defaultTargetOption: '_self',
      options: ['link', 'unlink'],
      linkCallback: undefined,
      unlinkCallback: undefined,
    },
    emoji: {
      icon: undefined,
      className: undefined,
      component: undefined,
      popupClassName: undefined,
      emojis: [
        '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '☺️', '🙂', '🤗', '🤩', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '🥱', '😴', '😌', '😛', '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '☹️', '🙁', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '🤯', '😬', '😰', '😱', '🥵', '🥶', '😳', '🤪', '😵', '🥴', '😠', '😡', '🤬', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '😇', '🥳', '🥺', '🤠', '🤡', '🤥', '🤫', '🤭', '🧐', '🤓', '😈', '👿', '👹', '👺', '💀', '☠️', '👻', '👽', '👾', '🤖', '💩', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾',
      ],
    },
    image: {
      icon: undefined,
      className: undefined,
      component: undefined,
      popupClassName: undefined,
      urlEnabled: true,
      uploadEnabled: true,
      alignmentEnabled: true,
      uploadCallback: undefined,
      previewImage: false,
      inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
      alt: { present: false, mandatory: false },
      defaultSize: {
        height: 'auto',
        width: 'auto',
      },
    },
    remove: { icon: undefined, className: undefined, component: undefined },
    history: {
      inDropdown: false,
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
      options: ['undo', 'redo'],
    },
  };

  return (
    <div className="w-full border rounded-lg overflow-hidden">
      <Editor
        editorState={editorState}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class p-4 min-h-96 prose max-w-none"
        toolbarClassName="toolbar-class border-b"
        onEditorStateChange={onEditorStateChange}
        placeholder={placeholder}
        toolbar={toolbarConfig}
        editorStyle={{
          minHeight: height,
          padding: '16px',
          fontSize: '14px',
          lineHeight: '1.6'
        }}
        toolbarStyle={{
          borderBottom: '1px solid #ddd',
          marginBottom: 0
        }}
        localization={{
          locale: 'ru',
        }}
        mention={{
          separator: ' ',
          trigger: '@',
          suggestions: [
            { text: 'APPLE', value: 'apple', url: 'apple' },
            { text: 'BANANA', value: 'banana', url: 'banana' },
            { text: 'CHERRY', value: 'cherry', url: 'cherry' },
            { text: 'DURIAN', value: 'durian', url: 'durian' },
            { text: 'EGGFRUIT', value: 'eggfruit', url: 'eggfruit' },
            { text: 'FIG', value: 'fig', url: 'fig' },
            { text: 'GRAPEFRUIT', value: 'grapefruit', url: 'grapefruit' },
            { text: 'HONEYDEW', value: 'honeydew', url: 'honeydew' },
          ],
        }}
        hashtag={{
          separator: ' ',
          trigger: '#',
        }}
      />
      
      <style>{`
        .wrapper-class {
          border: none !important;
        }
        .toolbar-class {
          border: none !important;
          border-bottom: 1px solid #e5e7eb !important;
          margin-bottom: 0 !important;
          padding: 12px !important;
          background: #f9fafb !important;
        }
        .editor-class {
          background: white !important;
          color: #374151 !important;
        }
        .editor-class:focus {
          outline: none !important;
        }
        .rdw-option-wrapper {
          border: 1px solid #d1d5db !important;
          margin-right: 4px !important;
          margin-bottom: 4px !important;
          border-radius: 4px !important;
        }
        .rdw-option-wrapper:hover {
          background: #f3f4f6 !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
        }
        .rdw-option-active {
          background: #dbeafe !important;
          border-color: #3b82f6 !important;
        }
        .rdw-dropdown-wrapper {
          border: 1px solid #d1d5db !important;
          border-radius: 4px !important;
        }
        .rdw-dropdown-selectedtext {
          color: #374151 !important;
        }
        .rdw-dropdownoption-default {
          color: #374151 !important;
        }
        .rdw-dropdownoption-highlighted {
          background: #f3f4f6 !important;
        }
        .public-DraftEditorPlaceholder-root {
          color: #9ca3af !important;
          font-style: italic !important;
        }
        .public-DraftEditor-content {
          min-height: ${height}px !important;
        }
        .DraftEditor-root table {
          border-collapse: collapse !important;
          border: 1px solid #d1d5db !important;
          width: 100% !important;
          margin: 1em 0 !important;
        }
        .DraftEditor-root table td,
        .DraftEditor-root table th {
          border: 1px solid #d1d5db !important;
          padding: 8px 12px !important;
          text-align: left !important;
        }
        .DraftEditor-root table th {
          background-color: #f9fafb !important;
          font-weight: 600 !important;
        }
        .DraftEditor-root img {
          max-width: 100% !important;
          height: auto !important;
          margin: 1em 0 !important;
        }
      `}</style>
    </div>
  );
}