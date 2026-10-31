import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

// 5MB max file size limit
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const isAllowedMime = ALLOWED_MIME_TYPES.includes(file.mimetype);
  const isAllowedExt = /\.(pdf|docx)$/i.test(file.originalname);

  if (isAllowedMime || isAllowedExt) {
    cb(null, true);
  } else {
    const error: any = new Error(
      'Unsupported file format. Please upload a PDF (.pdf) or Word document (.docx).'
    );
    error.code = 'INVALID_FILE_TYPE';
    error.statusCode = 400;
    cb(error, false);
  }
};

// Purely ephemeral in-memory storage (Zero disk persistence)
const memoryStorage = multer.memoryStorage();

export const resumeUpload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1, // Only 1 resume at a time
  },
  fileFilter,
});
