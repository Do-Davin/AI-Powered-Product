import { useEffect, useMemo, useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ProductDescriptionResult } from '@/features/product-desc/components/ProductDescriptionResult';
import { ProductImageUploader } from '@/features/product-desc/components/ProductImageUploader';
import { generateProductDescription } from '@/features/product-desc/services/productDescApi';
import type { GeneratedProductDescription } from '@/features/product-desc/types/productDesc.types';

function App() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [result, setResult] = useState<GeneratedProductDescription | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const previewUrl = useMemo(() => {
    if (!selectedImage) {
      return null;
    }

    return URL.createObjectURL(selectedImage);
  }, [selectedImage]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleImageSelect(image: File): void {
    setSelectedImage(image);
    setResult(null);
    setErrorMessage(null);
    setHasCopied(false);
  }

  function handleImageRemove(): void {
    setSelectedImage(null);
    setResult(null);
    setErrorMessage(null);
    setHasCopied(false);
  }

  async function handleGenerateDescription(): Promise<void> {
    if (!selectedImage) {
      setErrorMessage('Please upload a product image first.');
      return;
    }

    try {
      setIsGenerating(true);
      setErrorMessage(null);
      setHasCopied(false);

      const generatedDescription = await generateProductDescription({
        image: selectedImage,
      });

      setResult(generatedDescription);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong while generating the description.';

      setErrorMessage(message);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleCopyResult(): Promise<void> {
    if (!result) {
      return;
    }

    const textToCopy = formatResultForCopy(result);

    await navigator.clipboard.writeText(textToCopy);

    setHasCopied(true);

    window.setTimeout(() => {
      setHasCopied(false);
    }, 1500);
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            Product image to description
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              DT AI-Powered App
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Upload a product image and generate a clean product name,
              description, selling points, and hashtags.
            </p>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <ProductImageUploader
              selectedImage={selectedImage}
              previewUrl={previewUrl}
              onImageSelect={handleImageSelect}
              onImageRemove={handleImageRemove}
            />

            <Button
              type="button"
              size="lg"
              className="w-full"
              disabled={!selectedImage || isGenerating}
              onClick={handleGenerateDescription}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating description...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate description
                </>
              )}
            </Button>

            {errorMessage ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {errorMessage}
              </div>
            ) : null}
          </div>

          <ProductDescriptionResult
            result={result}
            isLoading={isGenerating}
            hasCopied={hasCopied}
            onCopy={handleCopyResult}
          />
        </section>
      </div>
    </main>
  );
}

function formatResultForCopy(result: GeneratedProductDescription): string {
  return [
    `Product name: ${result.productName}`,
    '',
    `Short description: ${result.shortDescription}`,
    '',
    `Long description: ${result.longDescription}`,
    '',
    'Selling points:',
    ...result.sellingPoints.map((point) => `- ${point}`),
    '',
    'Hashtags:',
    result.hashtags.join(' '),
  ].join('\n');
}

export default App;
