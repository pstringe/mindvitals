import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { FileSchema } from './entities/file.entity';
import { OrganizationsModule } from 'organizations/organizations.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: 'File', schema: FileSchema }],
      'clinic',
    ),
    OrganizationsModule,
  ],
  controllers: [FilesController],
  providers: [FilesService]
})
export class FilesModule {}
