import { useCallback, useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { Button } from './ui/button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  currentFile?: string | null;
  maxSizeMB?: number;
}

const ALLOWED_TYPES = ['.pdf', '.docx', '.doc', '.txt'];
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain'
];

export function FileUpload({ onFileSelect, currentFile, maxSizeMB = 10 }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    const maxSize = maxSizeMB * 1024 * 1024;
    
    if (file.size > maxSize) {
      alert(`Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB`);
      return false;
    }

    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_TYPES.includes(extension) && !ALLOWED_MIME_TYPES.includes(file.type)) {
      alert(`Tipo de arquivo não permitido. Use: ${ALLOWED_TYPES.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setSelectedFileName(file.name);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFileName(file.name);
      onFileSelect(file);
    }
  };

  const clearFile = () => {
    setSelectedFileName(null);
  };

  const displayFileName = selectedFileName || currentFile;

  return (
    <div className="space-y-2">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
          ${displayFileName ? 'bg-muted/30' : ''}
        `}
      >
        {displayFileName ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <FileText className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm truncate">{displayFileName}</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFile}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Arraste o arquivo aqui ou clique para selecionar
            </p>
            <p className="text-xs text-muted-foreground">
              PDF, DOCX, DOC ou TXT (máx. {maxSizeMB}MB)
            </p>
          </>
        )}
      </div>
      
      {!displayFileName && (
        <div>
          <input
            type="file"
            id="cv-upload"
            accept={ALLOWED_TYPES.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('cv-upload')?.click()}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Selecionar Arquivo
          </Button>
        </div>
      )}
    </div>
  );
}
