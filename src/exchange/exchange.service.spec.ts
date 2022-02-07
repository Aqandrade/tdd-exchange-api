import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesService, ExchangeService } from './exchange.service';

describe('ExchangeService', () => {
  let service: ExchangeService;
  let currenciesService: CurrenciesService;

  beforeEach(async () => {
    const currenciesServiceMock = {
      getCurrency: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeService,
        { provide: CurrenciesService, useFactory: () => currenciesServiceMock },
      ],
    }).compile();

    service = module.get<ExchangeService>(ExchangeService);
    currenciesService = module.get<CurrenciesService>(CurrenciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('convertAmount()', () => {
    it('shoud be throw if called with invalid params', async () => {
      await expect(
        service.convertAmount({ from: '', to: '', amount: 0 }),
      ).rejects.toThrow(new BadRequestException());
    });

    it('shoud not be throw if called with valid params', async () => {
      await expect(
        service.convertAmount({ from: 'USD', to: 'BRL', amount: 1 }),
      ).resolves.not.toThrow();
    });

    it('shoud be called getCurrent twice', async () => {
      await service.convertAmount({ from: 'USD', to: 'BRL', amount: 1 });
      expect(currenciesService.getCurrency).toBeCalledTimes(2);
    });

    it('shoud be called getCurrent with correct params', async () => {
      await service.convertAmount({ from: 'USD', to: 'BRL', amount: 1 });
      expect(currenciesService.getCurrency).toBeCalledWith('USD');
      expect(currenciesService.getCurrency).toHaveBeenLastCalledWith('BRL');
    });
  });
});
