import { ConsoleLogger, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { Express } from 'express';
import { Model } from 'mongoose';
import { File } from './entities/file.entity';
import { OrganizationsService } from 'organizations/organizations.service';

@Injectable()
export class FilesService {

  constructor(
    @InjectModel('File') 
    private readonly fileModel: Model<File>,
    private readonly organizationsService: OrganizationsService,
  ) {}

  public async upload(file: Express.Multer.File) {
    const newFile = new this.fileModel({
      name: file.originalname,
      type: file.mimetype,
      data: file.buffer,
      size: file.size,
    });
    newFile.save();
    return newFile;
  }

  public async uploadLogo(orgId: string, file: Express.Multer.File) {
    const logo = await this.upload(file);
    const organization = await this.organizationsService.update(orgId, { logo: logo._id });
    if (!organization) {
      throw new NotFoundException(`Organization with ID "${orgId}" not found (uploadLogo)`);
    }
    return organization;
  }

  findAll() {
    return `This action returns all files`;
  }

  public async findOne(id: string) {
    const file = await this.fileModel.findById(id);
    if (!file) {
      throw new NotFoundException(`File with ID "${id}" not found`);
    }
    return file;
  }

  public async findLogoByOrganization(id: string) {
    const organization = await this.organizationsService.findOne(id);
    console.log(organization);
    if (!organization) {
      throw new NotFoundException(`Organization with ID "${id}" not found (findLogoByOrganizationId)`);
    }
    const logo = await this.fileModel.findById(organization.logo);
    console.log(logo);
    if (!logo) {
      throw new NotFoundException(`Logo with ID "${organization.logo}" not found (findLogoByOrganizationId)`);
    }
    return logo;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
