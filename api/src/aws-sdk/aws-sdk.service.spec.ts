import { Test, TestingModule } from '@nestjs/testing'

import { AwsSdkService } from './aws-sdk.service'

describe('AwsSdkService', () => {
  let service: AwsSdkService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwsSdkService],
    }).compile()

    service = module.get<AwsSdkService>(AwsSdkService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
