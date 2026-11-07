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
    fontFamily: '"JetBrains Mono", Consolas, monospace',
  },
  ...props
}) => {
  return (
    <div className="w-full h-full min-h-[300px] rounded-xl overflow-hidden border border-[#F2DDD2] bg-white shadow-xs">
      <Editor
        language={language}
        theme={theme}
        value={value}
        options={options}
        loading={
          <div className="flex items-center justify-center h-full text-[#8C7268] text-xs">
            Loading Monaco Editor...
          </div>
        }
        {...props}
      />
    </div>
  );
};
export default CodeEditor;
