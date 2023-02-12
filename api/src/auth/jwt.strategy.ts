import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: req => {
        if (!req || !req.cookies) {
          return null
        }
        return req.cookies['access_token']
      },
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    })
  }

  public async validate(payload: any) {
    return payload
  }
}
