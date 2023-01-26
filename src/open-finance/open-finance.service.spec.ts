import { Test, TestingModule } from '@nestjs/testing';
import { OpenFinanceService } from './open-finance.service';

describe('OpenFinanceService', () => {
  let service: OpenFinanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenFinanceService],
    }).compile();

    service = module.get<OpenFinanceService>(OpenFinanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
