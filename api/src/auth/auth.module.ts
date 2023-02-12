import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { OrganizationsModule } from 'organizations/organizations.module'
import { UsersModule } from 'users/users.module'

import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'
import { LocalStrategy } from './local.strategy'
import { AuthController } from './auth.controller';
import { PersonnelModule } from 'personnel/personnel.module'

@Module({
  imports: [
    UsersModule,
    OrganizationsModule,
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
    PersonnelModule
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, JwtModule, PassportModule, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}