import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { CookieOptions, Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { OrganizationsService } from '../organizations/organizations.service'
import { UsersService } from '../users/users.service'
import { PersonnelService } from 'personnel/personnel.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly organizationsService: OrganizationsService,
    private readonly configService: ConfigService,
    private readonly personnelService: PersonnelService
  ) {}

  public async validateUser(username: string, password: string): Promise<any> {
    const searchName = username.toLowerCase();
    console.log('searchName', searchName);
    const user = await this.userService.findOne({ username: searchName });
    console.log('user (auth service)', user);
    const match = await bcrypt.compare(password, user.password)
    console.log('match', match);
    if (user && match) {
      const personnel = await this.personnelService.findPersonnel({ userId: user._id })
      const result = {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        organization: user.organization,
        providerId: personnel ? personnel._id : null,

      }
      return result
    }
    return null
  }

  public async login(response: Response, user: any) {
    const TWELVE_HOURS = 1000 * 60 * 60 * 12;
    const EXPIRATION = new Date(Date.now() + TWELVE_HOURS);
    const cookieOptions: CookieOptions = this.configService.get('CURRENT_ENV') === 'local' ? {
      httpOnly: true,
      expires: EXPIRATION,
    } : {
      httpOnly: true,
      expires: EXPIRATION,
      sameSite: 'none',
      secure: true,
    };
    
    const payload = {
      username: user.username,
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      organization: user.organization,
      providerId: user.providerId,
      expires: EXPIRATION,
    }

    /*
    ** set the active organization for future retrieval
    */

    this.organizationsService.setActiveOrganizationId(user.organization)

    /*
    ** Create token for user to authenticate future requests
    */

    const token = this.jwtService.sign(payload)
    response.cookie('access_token', token, cookieOptions)
    response.cookie('org', payload.organization, cookieOptions)
    const res = { success: true, user: payload };
    return res;
  }

  public async logout(response: Response) {
    const TWELVE_HOURS = 1000 * 60 * 60 * 12;
    const cookieOptions: CookieOptions = this.configService.get('CURRENT_ENV') === 'local' ? {
      httpOnly: true,
      expires: new Date(Date.now() - TWELVE_HOURS),
      } : {
      httpOnly: true,
      expires: new Date(Date.now() - TWELVE_HOURS),
      sameSite: 'none',
      secure: true,
    };
    response.cookie('access_token', '', cookieOptions)
    response.cookie('org', '', cookieOptions)
    console.log('logged out');
    return { success: true }
  }
}
