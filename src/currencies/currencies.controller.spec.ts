import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesController } from './currencies.controller';
import { CurrenciesService } from './currencies.service';
import { CurrenciesInputType } from './types/currencies-input.type';

describe('CurrenciesController', () => {
  let controller: CurrenciesController;
  let service: CurrenciesService;
  let mockData: CurrenciesInputType;

  beforeEach(async () => {
    const currenciesServiceMock = {
      getCurrency: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrenciesController],
      providers: [
        {
          provide: CurrenciesService,
          useFactory: () => currenciesServiceMock,
        },
      ],
    }).compile();

    controller = module.get<CurrenciesController>(CurrenciesController);
    service = module.get<CurrenciesService>(CurrenciesService);
    mockData = { currency: 'USD', value: 1 };
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCurrency()', () => {
    it('shoud be called service with correct params', async () => {
      await controller.getCurrency('USD');
      expect(service.getCurrency).toBeCalledWith('USD');
    });

    it('shoud be throw when services throw', async () => {
      service.getCurrency = jest
        .fn()
        .mockRejectedValue(new BadRequestException());
      await expect(controller.getCurrency('INVALID')).rejects.toThrow(
        new BadRequestException(),
      );
    });

    it('shoud be return when services return', async () => {
      service.getCurrency = jest.fn().mockReturnValue(mockData);
      expect(await controller.getCurrency('USD')).toEqual(mockData);
    });
  });
});
