import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FilesController } from './files.controller';
import { CloudinaryProvider } from './cloudinary.provider';
import { storageCloudinary } from './cloudinary.config';

@Module({
  imports: [
    MulterModule.register({
      storage: storageCloudinary,
    }),
  ],
  controllers: [FilesController],
  providers: [CloudinaryProvider],
  exports: [CloudinaryProvider],
})
export class FilesModule {}
