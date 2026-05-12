// This file handles the frontend request to your NestJS backend.
import type { GeneratedProductDescription } from '../types/productDesc.types';

const API_BASE_URL = 'http://localhost:3000';

type GenerateProductDescParams = {
  image: File;
};

export async function generateProductDescription({
  image,
}: GenerateProductDescParams): Promise<GeneratedProductDescription> {
  const formData = new FormData();
  formData.append('image', image);

  const response = await fetch(
    `${API_BASE_URL}/product-descriptions/generate`,
    {
      method: 'POST',
      body: formData,
    },
  );

  if (!response.ok) {
    const errorMessage = await getErrorMessage(response);
    throw new Error(errorMessage);
  }

  return response.json() as Promise<GeneratedProductDescription>;
}

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { message?: string };

    return data.message ?? 'Failed to generate product description.';
  } catch {
    return 'Failed to generate product description.';
  }
}
