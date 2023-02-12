import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { REQUEST } from '@nestjs/core'
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose'
import { OrganizationsService } from '../organizations/organizations.service'

@Injectable({ scope: Scope.REQUEST })
export class OrganizationDbConfigService implements MongooseOptionsFactory {
  constructor(
    @Inject(REQUEST) private readonly request,
    private readonly clinicService: OrganizationsService,
    private readonly configService: ConfigService,
  ) {}

  public async createMongooseOptions(): Promise<MongooseModuleOptions> {
    const orgId = this?.request?.cookies['org']
    const url = this.request?.url;
    const tokens = url.split('/').filter(token => token !== '');
    console.log('tokens', tokens);
    let publicRoute = false;
    if (tokens[0] === 'forgot-password') {
      publicRoute = true;
    }
    if (publicRoute) {
      const connection = `mongodb+srv://${this.configService.get(
      'AUTH_DB_USER',
      )}:${this.configService.get('AUTH_DB_PASSWORD')}@${this.configService.get(
      'AUTH_DB_HOST',
      )}/public?retryWrites=true&w=majority`
      this.clinicService.setActiveOrganizationId('public')
      return {uri: connection}
    }
    console.log('publicRoute', publicRoute);
    const org = await this.clinicService.findOne(orgId)
    if (!org) {
      throw new NotFoundException("This User's organization could not be found")
    }

    const connection = `mongodb+srv://${this.configService.get(
      'AUTH_DB_USER',
    )}:${this.configService.get('AUTH_DB_PASSWORD')}@${this.configService.get(
      'AUTH_DB_HOST',
    )}/${org?._id || 'public'}?retryWrites=true&w=majority`
    this.clinicService.setActiveOrganizationId(orgId || 'public')
    return { uri: connection }
  }
}
