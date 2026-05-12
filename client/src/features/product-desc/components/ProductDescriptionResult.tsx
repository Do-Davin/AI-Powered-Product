import { Check, Copy, FileText, Hash, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { GeneratedProductDescription } from '../types/productDesc.types';

type ProductDescriptionResultProps = {
  result: GeneratedProductDescription | null;
  isLoading: boolean;
  onCopy: () => void;
  hasCopied: boolean;
};

export function ProductDescriptionResult({
  result,
  isLoading,
  onCopy,
  hasCopied,
}: ProductDescriptionResultProps) {
  if (isLoading) {
    return <ProductDescriptionSkeleton />;
  }

  if (!result) {
    return (
      <Card className="h-full">
        <CardContent className="flex min-h-72 flex-col items-center justify-center p-6 text-center">
          <div className="mb-4 rounded-full border bg-muted p-4">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>

          <h2 className="text-lg font-semibold">Generated result</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Your product name, description, selling points, and hashtags will
            appear here after generation.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Generated result
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Review and copy the generated product copy.
          </p>
        </div>

        <Button type="button" variant="outline" size="sm" onClick={onCopy}>
          {hasCopied ? (
            <>
              <Check className="h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy
            </>
          )}
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <section className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Product name
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            {result.productName}
          </h2>
        </section>

        <section className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Short description
          </p>
          <p className="text-base leading-7">{result.shortDescription}</p>
        </section>

        <section className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Long description
          </p>
          <p className="text-sm leading-7 text-muted-foreground">
            {result.longDescription}
          </p>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            Selling points
          </p>

          <ul className="space-y-2">
            {result.sellingPoints.map((point) => (
              <li
                key={point}
                className="rounded-lg border bg-muted/30 px-3 py-2 text-sm"
              >
                {point}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Hash className="h-4 w-4" />
            Hashtags
          </p>

          <div className="flex flex-wrap gap-2">
            {result.hashtags.map((hashtag) => (
              <Badge key={hashtag} variant="secondary">
                {hashtag}
              </Badge>
            ))}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}

function ProductDescriptionSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 animate-pulse" />
          <CardTitle>Generating result</CardTitle>
        </div>

        <p className="text-sm text-muted-foreground">
          Reading the product image and writing the description...
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <SkeletonBlock className="h-8 w-2/3" />

        <div className="space-y-2">
          <SkeletonBlock className="h-4 w-36" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-5/6" />
        </div>

        <div className="space-y-2">
          <SkeletonBlock className="h-4 w-36" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-4/5" />
        </div>

        <div className="space-y-3">
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="h-10 w-full rounded-lg" />
          <SkeletonBlock className="h-10 w-full rounded-lg" />
          <SkeletonBlock className="h-10 w-11/12 rounded-lg" />
        </div>

        <div className="flex flex-wrap gap-2">
          <SkeletonBlock className="h-6 w-20 rounded-full" />
          <SkeletonBlock className="h-6 w-24 rounded-full" />
          <SkeletonBlock className="h-6 w-16 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

type SkeletonBlockProps = {
  className: string;
};

function SkeletonBlock({ className }: SkeletonBlockProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-md bg-muted ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-background/70 to-transparent" />
    </div>
  );
}
