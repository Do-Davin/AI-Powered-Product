import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ProductDescriptionController } from './product-desc/product-desc.controller';
import { ProductDescriptionService } from './product-desc/product-desc.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, ProductDescriptionController],
  providers: [AppService, ProductDescriptionService],
})
export class AppModule {}
