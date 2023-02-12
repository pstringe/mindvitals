import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MigrationsService } from './migrations.service';


@Controller('migrations')
export class MigrationsController {
  constructor(private readonly migrationsService: MigrationsService,) {}
  /*
  @Get('/genPersonnel/:orgId/:count')
  public async generatePersonnel(@Param('orgId') orgId: string, @Param('count') count: number) {
    return this.migrationsService.generatePersonnel(orgId, count);
  }

  @Get('/genPatients/:personnelId/:count')
  public async generatePatients(@Param('personnelId') personnelId: string, @Param('count') count: number) {
    return this.migrationsService.generatePatients(personnelId, count);
  }
  */
  
  @Post('/addPatientsFromJson/:orgId/:personnelId')
  public async addPatientsFromJson(@Param('orgId') orgId: string, @Param('personnelId') personnelId: string, @Body() patients: any) {
    return this.migrationsService.addPatientsFromJson(orgId, personnelId, patients);
  }
  
}
