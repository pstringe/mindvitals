import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { OrganizationDbConfigService } from 'organization-db-config/organization-db-config.service'

import { PersonnelSchema } from './entities/personnel.entity'
import { PersonnelController } from './personnel.controller'
import { PersonnelService } from './personnel.service'

@Module({
  imports: [
    OrganizationDbConfigService,
    MongooseModule.forFeature(
      [{ name: 'Personnel', schema: PersonnelSchema }],
      'global',
    ),
  ],
  controllers: [PersonnelController],
  providers: [PersonnelService],
  exports: [PersonnelService],
})
export class PersonnelModule {}
