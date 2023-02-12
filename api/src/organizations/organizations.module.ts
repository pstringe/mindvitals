import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { OrganizationSchema } from './entities/clinic.entity'
import { OrganizationsController } from './organizations.controller'
import { OrganizationsService } from './organizations.service'

@Global()
@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: 'Organization', schema: OrganizationSchema }],
      'global',
    ),
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
