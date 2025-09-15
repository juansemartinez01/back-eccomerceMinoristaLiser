import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  Inject,
  HttpException,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';

@Controller('files')
export class FilesController {
  constructor(@Inject('CLOUDINARY') private cloudinary) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file) {
    return {
      url: file.path, // Devuelve la URL de Cloudinary
    };
  }

  @Delete('delete/:publicId')
  async deleteFile(@Param('publicId') publicId: string) {
    try {
      const result = await this.cloudinary.uploader.destroy(publicId);
      if (result.result !== 'ok') {
        throw new HttpException(
          'Failed to delete image',
          HttpStatus.BAD_REQUEST,
        );
      }
      return { message: 'Image deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('list')
  async listFiles() {
    try {
      const result = await this.cloudinary.api.resources({
        type: 'upload', // Solo imágenes subidas por el usuario
        prefix: 'uploads/', // Opcional: Filtrar por carpeta específica
        max_results: 500, // Número de imágenes a obtener
      });

      return result.resources.map((file) => ({
        url: file.secure_url,
        public_id: file.public_id,
      }));
    } catch (error) {
      throw new HttpException(
        'Failed to fetch images',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
