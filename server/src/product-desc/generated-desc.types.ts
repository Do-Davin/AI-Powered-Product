export type GeneratedProductDescription = {
  productName: string;
  shortDescription: string;
  longDescription: string;
  sellingPoints: string[];
  hashtags: string[];
};

export type GeminiGeneratedDescription = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

// This file stores the TypeScript types for the generated product description.
