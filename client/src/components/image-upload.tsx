import { ImageIcon, X } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";

interface Props {
  value?: string | null;
  file?: File | null;
  onChange: (value: string | File | null) => void;
}

export function ImageUpload({ value, file, onChange }: Props) {
  const fullUrl = value
    ? value.startsWith("http")
      ? value
      : `http://localhost:4000${value}`
    : file 
      ? URL.createObjectURL(file)
      : null;

  const [files, setFiles] = React.useState<File[]>(file ? [file] : []);

  // Cleanup object URL
  React.useEffect(() => {
    return () => {
      if (fullUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(fullUrl);
      }
    };
  }, [fullUrl]);

  const handleValueChange = (newFiles: File[]) => {
    setFiles(newFiles);
    if (newFiles.length > 0) {
      onChange(newFiles[0]);
    } else {
      onChange(null);
    }
  };

  return (
    <div className="w-full space-y-4">
      {fullUrl && (
        <div className="flex justify-center">
          <div className="relative h-40 w-40 rounded-2xl border-2 border-primary/20 p-1 bg-muted/50 overflow-hidden shadow-md group">
            <img
              src={fullUrl}
              alt="Preview"
              className="h-full w-full object-cover rounded-xl transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setFiles([]);
                }}
                className="p-2 rounded-full bg-destructive text-white shadow-lg hover:scale-110 transition-transform"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {!fullUrl && (
        <FileUpload
          maxFiles={1}
          maxSize={2 * 1024 * 1024}
          value={files}
          onValueChange={handleValueChange}
          accept="image/*"
          className="w-full"
        >
          <FileUploadDropzone className="border-primary/20 bg-primary/5 hover:bg-primary/10 data-dragging:bg-primary/10 py-8 rounded-2xl transition-all border-2 border-dashed">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="rounded-2xl bg-primary/10 p-4 shadow-inner">
                <ImageIcon className="size-10 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">Tải ảnh sản phẩm lên</p>
                <p className="text-xs text-muted-foreground max-w-[200px]">
                  PNG, JPG hoặc WebP (Tối đa 2MB)
                </p>
              </div>
              <FileUploadTrigger asChild>
                <Button size="sm" variant="secondary" className="mt-2 rounded-full px-6 shadow-sm border">
                  Chọn ảnh từ máy tính
                </Button>
              </FileUploadTrigger>
            </div>
          </FileUploadDropzone>
          <FileUploadList className="mt-4">
            {files.map((file, index) => (
              <FileUploadItem key={`${file.name}-${index}`} value={file} className="bg-background border rounded-xl p-3 shadow-sm">
                <FileUploadItemPreview className="rounded-lg border overflow-hidden size-12" />
                <FileUploadItemMetadata className="ml-2" />
                <FileUploadItemDelete asChild>
                  <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-destructive/10 hover:text-destructive">
                    <X className="size-4" />
                  </Button>
                </FileUploadItemDelete>
              </FileUploadItem>
            ))}
          </FileUploadList>
        </FileUpload>
      )}
    </div>
  );
}
