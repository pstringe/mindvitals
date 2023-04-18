import faker from '@faker-js/faker'
import { Test, TestingModule } from '@nestjs/testing'

import { PatientsController } from './patients.controller'
import { PatientsService } from './patients.service'

describe('PatientsController', () => {
  let controller: PatientsController
  const TEST_PROVIDER_ID = '63e928e436cf48be2e0dc941'

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientsController],
      providers: [PatientsService],
    }).compile()

    controller = module.get<PatientsController>(PatientsController)
  })

  it('should add patient records to the database', async () => {
    const numPatients = 10 // generate 10 patients

    // generate an array of patient data using faker.js
    const patientData = Array.from({ length: numPatients }, () => ({
      dob: faker.date.past(),
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      phoneNo: faker.phone.phoneNumber(),
      providerId: TEST_PROVIDER_ID,
    }))

    // add patient data to the database using the PatientsController's create method
    for (const data of patientData) {
      await controller.create(data)
    }

    // verify that the records were added to the database
    const result = await controller.findAll({ skip: 0, limit: numPatients }, {})
    expect(result.patients.length).toBe(numPatients)

    // remove the patient records
    for (const data of patientData) {
      const patient = await controller.findOne(data.providerId)
      await controller.remove(patient.id)
    }
  })
})
