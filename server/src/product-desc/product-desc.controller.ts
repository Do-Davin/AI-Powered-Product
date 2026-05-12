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

    return this.productDescriptionService.generateFromImage(image);
  }
}
