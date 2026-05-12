import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import { useRef, type ChangeEvent } from 'react';

type ProductImageUploaderProps = {
  selectedImage: File | null;
  previewUrl: string | null;
  onImageSelect: (image: File) => void;
  onImageRemove: () => void;
};

const ACCEPTED_IMAGE_TYPES =
  'image/png,image/jpeg,image/jpg,image/webp,image/gif';

export function ProductImageUploader({
  selectedImage,
  previewUrl,
  onImageSelect,
  onImageRemove,
}: ProductImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleOpenFilePicker(): void {
    inputRef.current?.click();
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>): void {
    const image = event.target.files?.[0];

    if (!image) {
      return;
    }

    onImageSelect(image);

    event.target.value = '';
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div>
          <h2 className="text-lg font-semibold">Product Image</h2>
          <p className="text-sm text-muted-foreground">
            Upload a clear product image to generate a selling description.
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES}
          className="hidden"
          onChange={handleImageChange}
        />

        {previewUrl ? (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border bg-muted">
              <img
                src={previewUrl}
                alt={selectedImage?.name ?? 'Selected product'}
                className="h-72 w-full object-contain"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {selectedImage?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Image ready for generation
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onImageRemove}
              >
                <X className="h-4 w-4">Remove</X>
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleOpenFilePicker}
            className="flex min-h-72 w-full flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 px-6 text-center transition hover:bg-muted/50"
          >
            <div className="mb-4 rounded-full border bg-background p-4">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>

            <p className="text-sm font-medium">Click to upload product image</p>
            <p className="mt-1 text-xs text-muted-foreground">
              PNG, JPG, WEBP, or GIF
            </p>
          </button>
        )}
      </CardContent>
    </Card>
  );
}
