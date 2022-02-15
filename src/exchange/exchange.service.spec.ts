import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesService } from '../currencies/currencies.service';
import { ConvertAmountDto } from './dto/convert-amount.dto';
import { ExchangeService } from './exchange.service';

describe('ExchangeService', () => {
  let service: ExchangeService;
  let currenciesService: CurrenciesService;
  let mockData: ConvertAmountDto;

  beforeEach(async () => {
    const currenciesServiceMock = {
      getCurrency: jest.fn().mockReturnValue({ value: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeService,
        { provide: CurrenciesService, useFactory: () => currenciesServiceMock },
      ],
    }).compile();

    service = module.get<ExchangeService>(ExchangeService);
    currenciesService = module.get<CurrenciesService>(CurrenciesService);
    mockData = { from: 'USD', to: 'BRL', amount: 1 };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('convertAmount()', () => {
    it('shoud be throw if called with invalid params', async () => {
      mockData.from = '';
      await expect(service.convertAmount(mockData)).rejects.toThrow(
        new BadRequestException(),
      );

      mockData.from = 'USD';
      mockData.amount = 0;
      await expect(service.convertAmount(mockData)).rejects.toThrow(
        new BadRequestException(),
      );

      mockData.from = 'USD';
      mockData.to = '';
      mockData.amount = 1;
      await expect(service.convertAmount(mockData)).rejects.toThrow(
        new BadRequestException(),
      );
    });

    it('shoud not be throw if called with valid params', async () => {
      await expect(service.convertAmount(mockData)).resolves.not.toThrow();
    });

    it('shoud be called getCurrent twice', async () => {
      await service.convertAmount(mockData);
      expect(currenciesService.getCurrency).toBeCalledTimes(2);
    });

    it('shoud be called getCurrency with correct params', async () => {
      await service.convertAmount(mockData);
      expect(currenciesService.getCurrency).toBeCalledWith('USD');
      expect(currenciesService.getCurrency).toHaveBeenLastCalledWith('BRL');
    });

    it('shoud be throw when getCurrency throws', async () => {
      mockData.from = 'INVALID';
      (currenciesService.getCurrency as jest.Mock).mockRejectedValue(
        new Error(),
      );

      await expect(service.convertAmount(mockData)).rejects.toThrow();
    });

    it('shoud be return conversion value', async () => {
      (currenciesService.getCurrency as jest.Mock).mockResolvedValue({
        value: 1,
      });

      mockData.from = 'USD';
      mockData.to = 'USD';
      expect(await service.convertAmount(mockData)).toEqual({ amount: 1 });

      (currenciesService.getCurrency as jest.Mock).mockResolvedValueOnce({
        value: 1,
      });

      (currenciesService.getCurrency as jest.Mock).mockResolvedValueOnce({
        value: 0.2,
      });

      mockData.from = 'USD';
      mockData.from = 'BRL';
      expect(await service.convertAmount(mockData)).toEqual({
        amount: 5,
      });

      (currenciesService.getCurrency as jest.Mock).mockResolvedValueOnce({
        value: 0.2,
      });

      (currenciesService.getCurrency as jest.Mock).mockResolvedValueOnce({
        value: 1,
      });

      mockData.from = 'BRL';
      mockData.to = 'USD';
      expect(await service.convertAmount(mockData)).toEqual({
        amount: 0.2,
      });
    });
  });
});
