import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

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
        onClick={() => fileInputRef.current?.click()}
        className={`p-8 sm:p-12 rounded-3xl border-2 border-dashed cursor-pointer transition text-center space-y-4 ${
          isDragOver
            ? 'border-[#F0B87A] bg-[#2D1A10]'
            : selectedFile
            ? 'border-[#F0B87A] bg-[#1E0E0B]'
            : 'border-[#3E1D19] bg-[#140705] hover:border-[#F0B87A]/50 hover:bg-[#1A0C09]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />

        <div className="flex justify-center">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition ${
              selectedFile
                ? 'bg-[#2D1A10] text-[#F0B87A] border border-[#522E22]'
                : 'bg-[#1A0C09] text-[#A88879] border border-[#3E1D19]'
            }`}
          >
            {selectedFile ? (
              <FileText className="w-8 h-8 text-[#F0B87A]" />
            ) : (
              <UploadCloud className="w-8 h-8 text-[#A88879]" />
            )}
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-serif font-medium text-[#F5E8DD]">
            {selectedFile ? selectedFile.name : 'Upload your resume'}
          </h3>
          <p className="text-xs text-[#A88879] max-w-sm mx-auto">
            {selectedFile
              ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Click to replace`
              : 'Drag & drop your PDF or DOCX here, or click to browse'}
          </p>
        </div>

        <div className="text-[11px] text-[#856658]">
          PDF or DOCX up to 5MB · Scanned for ATS parsing rubrics
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-[#2A100E] border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {selectedFile && !errorMsg && (
        <div className="p-3.5 rounded-2xl bg-[#1A0C09] border border-[#3E1D19] flex items-center justify-between text-xs text-[#F0B87A]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#F0B87A]" />
            <span>Ready for 4-pillar ATS extraction</span>
          </div>
          <span className="text-[#856658]">Auto-detected</span>
        </div>
      )}
    </div>
  );
};
