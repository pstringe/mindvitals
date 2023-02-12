import { Injectable } from '@nestjs/common';
import { OrganizationsService } from 'organizations/organizations.service';
import passport from 'passport';
import { PatientsService } from 'patients/patients.service';
import { PersonnelService } from 'personnel/personnel.service';
import { CreateUserDto } from 'users/dto/create-user.dto';
import { UsersService } from 'users/users.service';
import { CreateMigrationDto } from './dto/create-migration.dto';
import { UpdateMigrationDto } from './dto/update-migration.dto';
//import faker from '@faker-js/faker';
import { CreatePatientDto } from 'patients/dto/create-patient.dto';
//import * as PATIENTS_FILE from './patients.json';

@Injectable()
export class MigrationsService {

  constructor(
    private readonly personnelService: PersonnelService,
    private readonly patientsService: PatientsService,
    private readonly usersService: UsersService,
    private readonly organizationsService: OrganizationsService,
    ) { }

    /*
    public async generatePersonnel(orgId: string, count: number) {
      for (let i = 0; i < count; i++) {
        const user = await this.usersService.addUser({
          "username": faker.internet.email(),
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "password": "password",
          "organization": orgId,
          "personnel": true
        } as CreateUserDto);
        console.log(user);
      }
      console.log(`Generated ${count} personnel for org ${orgId}`);
    }

    public async generatePatients(personnelId: string, count: number) {
      for (let i = 0; i < count; i++) {
        const patient = await this.patientsService.create({
          "firstName": faker.name.firstName(),
          "lastName": faker.name.lastName(),
          "phoneNo": faker.phone.phoneNumber(),
          "email": faker.internet.email(),
          "dob": faker.date.past(),
          "providerId": personnelId
        } as CreatePatientDto);
      }
    }

    /*
    private getJsonData(fileName: string) {
      const data = require(`./${fileName}`);
      return data;
    }
    */
    
    public async addPatientsFromJson(orgId: string, personnelId: string, patients: any[]) {
      //const fileName = 'patients.json';
      const data = patients;
      for (let i = 0; i < data.length; i++) {
        const patient = await this.patientsService.create({
          firstName: data[i].firstName as string,
          lastName: data[i].lastName as string,
          phoneNo: data[i].phoneNo as string,
          email: data[i].email as string,
          dob: new Date(data[i].dob),
          providerId: personnelId
        } as CreatePatientDto);    
      }
    }
    
 
}
