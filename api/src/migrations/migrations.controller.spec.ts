import { Test, TestingModule } from '@nestjs/testing';
import { MigrationsController } from './migrations.controller';
import { MigrationsService } from './migrations.service';

describe('MigrationsController', () => {
  let controller: MigrationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MigrationsController],
      providers: [MigrationsService],
    }).compile();

    controller = module.get<MigrationsController>(MigrationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
