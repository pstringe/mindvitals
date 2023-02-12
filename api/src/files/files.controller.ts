import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Response, StreamableFile } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.upload(file);
  }

  @Post('/upload/logo/:organization_id')
  @UseInterceptors(FileInterceptor('file'))
  uploadOrganizationLogo(@Param('organization_id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.filesService.uploadLogo(id, file);
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string, @Response({ passthrough: true }) res) {
    const file = await this.filesService.findOne(id);
   
    res.set({
      'Content-Type': `${file.type}`,
      'Content-Disposition': `inline; filename="${file.name}"`,
    });
    return new StreamableFile(file.data);
  }

  @Get('/logoByOrganization/:organization_id')
  public async findLogoByOrganization(@Param('organization_id') id: string, @Response({ passthrough: true }) res) {
    const file = await this.filesService.findLogoByOrganization(id);

    res.set({
      'Content-Type': `${file.type}`,
      'Content-Disposition': `inline; filename="${file.name}"`,
    });
    return new StreamableFile(file.data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }
}
