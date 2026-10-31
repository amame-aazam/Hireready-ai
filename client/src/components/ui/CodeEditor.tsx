import React from 'react';
import Editor, { EditorProps } from '@monaco-editor/react';

interface CodeEditorProps extends EditorProps {
  isLoading?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  language = 'javascript',
  theme = 'vs-dark',
  value = '// Start coding here...',
  options = {
    minimap: { enabled: false },
    fontSize: 14,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
  },
  ...props
}) => {
  return (
    <div className="w-full h-full min-h-[300px] rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
      <Editor
        language={language}
        theme={theme}
        value={value}
        options={options}
        loading={
          <div className="flex items-center justify-center h-full text-slate-400 text-sm">
            Loading Monaco Code Editor...
          </div>
        }
        {...props}
      />
    </div>
  );
};
