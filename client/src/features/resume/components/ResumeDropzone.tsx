import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface ResumeDropzoneProps {
  onFileSelected: (file: File) => void;
  isUploading: boolean;
}

export const ResumeDropzone: React.FC<ResumeDropzoneProps> = ({
  onFileSelected,
  isUploading,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSet = (file: File) => {
    setErrorMsg(null);
    const validExtensions = /\.(pdf|docx)$/i;
    if (!validExtensions.test(file.name)) {
      setErrorMsg('Please upload a PDF (.pdf) or Word document (.docx).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 5MB limit.');
      return;
    }
    setSelectedFile(file);
    onFileSelected(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSet(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSet(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
          isDragOver
            ? 'border-indigo-400 bg-indigo-500/10 scale-[1.01]'
            : 'border-slate-700/80 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-900'
        } ${isUploading ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />

        <div className="p-3.5 rounded-full bg-slate-800 text-indigo-400 border border-slate-700">
          {isUploading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <UploadCloud className="w-8 h-8" />
          )}
        </div>

        {selectedFile ? (
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-white">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>{selectedFile.name}</span>
              <span className="text-xs text-slate-400">
                ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
              </span>
            </div>
            <p className="text-xs text-emerald-400 flex items-center justify-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> File ready for ATS analysis
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-200">
              Drag &amp; drop your resume here, or <span className="text-indigo-400">browse</span>
            </p>
            <p className="text-xs text-slate-400">
              Supports text-based PDF or DOCX up to 5MB (Zero permanent storage)
            </p>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
