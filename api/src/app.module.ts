import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './auth/auth.module'
import { AuthService } from './auth/auth.service'
import { OrganizationsModule } from './organizations/organizations.module'
import { PersonnelModule } from './personnel/personnel.module'
import { OrganizationDbConfigService } from './organization-db-config/organization-db-config.service'
import { OrganizationDbConfigModule } from './organization-db-config/organization-db-config.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PatientsModule } from './patients/patients.module'
import { AssessmentsModule } from './assessments/assessments.module'
import { QuestionnairesModule } from './questionnaires/questionnaires.module'
import { BatchModule } from './batch/batch.module'
import { AwsSdkModule } from './aws-sdk/aws-sdk.module'
import { NotificationsModule } from './notifications/notifications.module'
import { ValidationModule } from './validation/validation.module'
import { FilesModule } from './files/files.module';
import { ReferralsModule } from './referrals/referrals.module';
import { MigrationsModule } from './migrations/migrations.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'config.staging.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const connection = `mongodb+srv://${configService.get(
          'AUTH_DB_USER',
        )}:${configService.get('AUTH_DB_PASSWORD')}@${configService.get(
          'AUTH_DB_HOST',
        )}/${configService.get('AUTH_DB_NAME')}?retryWrites=true&w=majority`
        console.log('connection', connection);
        return {
          uri: connection,
        }
      },
      connectionName: 'global',
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [OrganizationDbConfigModule],
      inject: [OrganizationsModule],
      useExisting: OrganizationDbConfigService,
      connectionName: 'clinic',
    }),
    AuthModule,
    OrganizationsModule,
    PersonnelModule,
    OrganizationDbConfigModule,
    UsersModule,
    PatientsModule,
    AssessmentsModule,
    QuestionnairesModule,
    BatchModule,
    AwsSdkModule,
    NotificationsModule,
    ValidationModule,
    FilesModule,
    ReferralsModule,
    MigrationsModule,
    ForgotPasswordModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
