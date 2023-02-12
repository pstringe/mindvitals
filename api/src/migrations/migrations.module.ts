import { Module } from '@nestjs/common';
import { MigrationsService } from './migrations.service';
import { MigrationsController } from './migrations.controller';
import { PersonnelModule } from 'personnel/personnel.module';
import { PatientsModule } from 'patients/patients.module';
import { UsersModule } from 'users/users.module';
import { OrganizationsModule } from 'organizations/organizations.module';

@Module({
  imports: [
    PersonnelModule,
    UsersModule,
    OrganizationsModule,
    PatientsModule,
  ],
  controllers: [MigrationsController],
  providers: [MigrationsService]
})
export class MigrationsModule {}
