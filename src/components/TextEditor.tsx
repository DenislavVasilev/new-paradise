import React, { useRef, useState, useEffect } from 'react';
import { Bold, Italic, List, AlignLeft, AlignCenter, AlignRight, Type } from 'lucide-react';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextEditor: React.FC<TextEditorProps> = ({ value, onChange, placeholder }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.contentEditable = 'true';
    }
  }, []);

  const execCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (editorRef.current) {
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  const ToolbarButton = ({ onClick, icon: Icon, title }: { 
    onClick: () => void;
    icon: React.ElementType;
    title: string;
  }) => (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        onClick();
        editorRef.current?.focus();
      }}
      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      title={title}
    >
      <Icon className="w-5 h-5" />
    </button>
  );

  return (
    <div 
      className={`border rounded-lg overflow-hidden bg-white shadow-sm transition-shadow duration-200 ${
        isFocused ? 'ring-2 ring-primary ring-opacity-50 shadow-md' : ''
      }`}
      onClick={() => editorRef.current?.focus()}
    >
      <div className="flex items-center gap-1 p-2 bg-gray-50 border-b">
        <ToolbarButton
          onClick={() => execCommand('bold')}
          icon={Bold}
          title="Удебелен текст"
        />
        <ToolbarButton
          onClick={() => execCommand('italic')}
          icon={Italic}
          title="Курсив"
        />
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton
          onClick={() => execCommand('insertUnorderedList')}
          icon={List}
          title="Списък"
        />
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton
          onClick={() => execCommand('justifyLeft')}
          icon={AlignLeft}
          title="Подравни вляво"
        />
        <ToolbarButton
          onClick={() => execCommand('justifyCenter')}
          icon={AlignCenter}
          title="Центрирай"
        />
        <ToolbarButton
          onClick={() => execCommand('justifyRight')}
          icon={AlignRight}
          title="Подравни вдясно"
        />
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <select
          onChange={(e) => {
            execCommand('formatBlock', e.target.value);
            editorRef.current?.focus();
          }}
          className="px-3 py-1.5 border rounded-lg text-sm bg-white hover:bg-gray-50 focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary transition-colors cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <option value="p">Нормален текст</option>
          <option value="h1">Заглавие 1</option>
          <option value="h2">Заглавие 2</option>
          <option value="h3">Заглавие 3</option>
        </select>
      </div>

      <style>
        {`
          [contenteditable=true]:empty:before {
            content: attr(placeholder);
            color: #9CA3AF;
            pointer-events: none;
            display: block;
          }
          [contenteditable=true] {
            outline: none;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          [contenteditable=true] h1 {
            font-size: 1.875rem;
            font-weight: 700;
            margin-bottom: 1rem;
          }
          [contenteditable=true] h2 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 0.875rem;
          }
          [contenteditable=true] h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
          }
          [contenteditable=true] p {
            margin-bottom: 0.75rem;
          }
          [contenteditable=true] ul {
            list-style-type: disc;
            margin-left: 1.25rem;
            margin-bottom: 0.75rem;
          }
          [contenteditable=true] li {
            margin-bottom: 0.25rem;
          }
        `}
      </style>

      <div
        ref={editorRef}
        contentEditable="true"
        className="p-6 min-h-[200px] text-gray-800 leading-relaxed focus:outline-none"
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={updateContent}
        onFocus={handleFocus}
        onBlur={() => setIsFocused(false)}
        onPaste={handlePaste}
        placeholder={placeholder}
        style={{
          cursor: 'text',
          WebkitUserSelect: 'text',
          userSelect: 'text'
        }}
      />
    </div>
  );
};

export default TextEditor;