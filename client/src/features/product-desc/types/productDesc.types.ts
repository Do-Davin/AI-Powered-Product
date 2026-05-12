// This file defines the response shape from your backend.
export type GeneratedProductDescription = {
  productName: string;
  shortDescription: string;
  longDescription: string;
  sellingPoints: string[];
  hashtags: string[];
};

export type ProductDescRequestState = {
  isLoading: boolean;
  errorMessage: string | null;
};
