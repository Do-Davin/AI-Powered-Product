import { GoogleGenAI } from '@google/genai';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GeneratedProductDescription } from './generated-desc.types';
import { PRODUCT_DESCRIPTION_PROMPT } from './product-desc.prompt';

export interface ProductImageFile {
  buffer: Buffer;
  mimetype: string;
}

@Injectable()
export class ProductDescriptionService {
  private readonly googleGenAI: GoogleGenAI;

  constructor() {
    const apiKey = process.env['GEMINI_API_KEY'];

    if (!apiKey) {
      throw new InternalServerErrorException('Missing GEMINI_API_KEY');
    }

    this.googleGenAI = new GoogleGenAI({ apiKey });
  }

  async generateFromImage(
    image: ProductImageFile,
  ): Promise<GeneratedProductDescription> {
    const imageBase64 = image.buffer.toString('base64');

    const response = await this.googleGenAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: PRODUCT_DESCRIPTION_PROMPT,
            },
            {
              inlineData: {
                mimeType: image.mimetype,
                data: imageBase64,
              },
            },
          ],
        },
      ],
    });

    const text = response.text;

    if (!text) {
      throw new InternalServerErrorException(
        'Gemini did not return any description',
      );
    }

    return this.parseGeneratedDescription(text);
  }

  private parseGeneratedDescription(text: string): GeneratedProductDescription {
    try {
      const cleanedText = text
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/i, '')
        .trim();

      return JSON.parse(cleanedText) as GeneratedProductDescription;
    } catch {
      throw new InternalServerErrorException(
        'Failed to parse Gemini response as JSON',
      );
    }
  }
}
