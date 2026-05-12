import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GeneratedProductDescription } from './generated-desc.types';
import { ProductDescriptionService } from './product-desc.service';
import type { ProductImageFile } from './product-desc.service';

@Controller('product-descriptions')
export class ProductDescriptionController {
  constructor(
    private readonly productDescriptionService: ProductDescriptionService,
  ) {}

  @Post('generate')
  @UseInterceptors(FileInterceptor('image'))
  async generateDescription(
    @UploadedFile() image?: ProductImageFile,
  ): Promise<GeneratedProductDescription> {
    if (!image) {
      throw new BadRequestException('Product image is required');
    }

    if (!image.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    if (!this.isSupportedImage(image)) {
      throw new BadRequestException('Uploaded file is not a supported image');
    }

    return this.productDescriptionService.generateFromImage(image);
  }

  private isSupportedImage(image: ProductImageFile): boolean {
    const { buffer } = image;

    if (buffer.length < 4) {
      return false;
    }

    const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8;
    const isPng =
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47;
    const isGif = buffer.subarray(0, 3).toString('ascii') === 'GIF';
    const isWebp =
      buffer.length >= 12 &&
      buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP';

    return isJpeg || isPng || isGif || isWebp;
  }
}
