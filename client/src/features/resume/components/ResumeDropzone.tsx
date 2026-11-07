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
            ? 'border-[#FF7A48] bg-[#FFEBE1]/30'
            : selectedFile
            ? 'border-[#B7E1CD] bg-[#E6F4EA]/20'
            : 'border-[#F2DDD2] bg-white hover:border-[#FF7A48]/50 hover:bg-[#FFFAF7]'
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
          {selectedFile ? (
            <div className="p-4 rounded-2xl bg-[#E6F4EA] text-[#1F7A3A] border border-[#B7E1CD]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#FFEBE1] text-[#FF7A48] border border-[#FFD0BC]">
              <UploadCloud className="w-8 h-8" />
            </div>
          )}
        </div>

        <div className="space-y-1">
          {selectedFile ? (
            <>
              <h3 className="text-sm font-semibold text-[#0A0706] flex items-center justify-center gap-1.5">
                <FileText className="w-4 h-4 text-[#FF7A48]" />
                <span>{selectedFile.name}</span>
              </h3>
              <p className="text-xs text-[#6B544A]">
                {(selectedFile.size / 1024).toFixed(1)} KB &bull; Click or drag to replace
              </p>
            </>
          ) : (
            <>
              <h3 className="text-base font-serif font-medium text-[#0A0706]">
                Click or drag resume here to upload
              </h3>
              <p className="text-xs text-[#6B544A]">
                Supports PDF and DOCX up to 5MB. Evaluates ATS keywords, structure, and impact.
              </p>
            </>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-2xl bg-[#FFF4EC] border border-[#F2DDD2] text-xs text-[#A83E14] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#FF7A48]" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
export default ResumeDropzone;
