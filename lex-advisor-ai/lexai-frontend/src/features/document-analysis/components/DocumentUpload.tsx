import React from 'react';
import { Upload, FileText, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DocumentUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  onUpload: () => void;
  uploading: boolean;
  uploadProgress: number;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  file,
  onFileChange,
  onUpload,
  uploading,
  uploadProgress
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="text-blue-600" size={24} />
          Upload Document
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => onFileChange(e.target.files?.[0] || null)}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <FileText size={48} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-600 mb-2">
              {file ? file.name : 'Click to upload or drag and drop'}
            </p>
            <p className="text-sm text-slate-400">PDF files up to 50MB</p>
          </label>
        </div>

        {file && (
          <div className="mt-4 flex items-center justify-between bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-600" size={20} />
              <span className="text-sm font-medium text-slate-700">{file.name}</span>
            </div>
            <button
              onClick={() => onFileChange(null)}
              className="text-slate-400 hover:text-red-500"
            >
              ×
            </button>
          </div>
        )}

        {uploading && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-600">Processing...</span>
              <span className="font-medium text-blue-600">{uploadProgress}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <Button
          onClick={onUpload}
          disabled={!file || uploading}
          className="w-full mt-6"
          size="lg"
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Upload & Analyze
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
