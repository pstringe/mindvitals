import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { OrganizationsModule } from '../organizations/organizations.module'
import { OrganizationDbConfigService } from './organization-db-config.service'

@Module({
  imports: [OrganizationsModule, ConfigModule],
  providers: [OrganizationDbConfigService],
  exports: [OrganizationDbConfigService],
})
export class OrganizationDbConfigModule {}
