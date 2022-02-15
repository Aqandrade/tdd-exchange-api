import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';
import { ExchangeType } from './types/exchange.type';

describe('ExchangeController', () => {
  let controller: ExchangeController;
  let service: ExchangeService;
  let mockData;

  beforeEach(async () => {
    const exchangeServiceMock = {
      convertAmount: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExchangeController],
      providers: [
        {
          provide: ExchangeService,
          useFactory: () => exchangeServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ExchangeController>(ExchangeController);
    service = module.get<ExchangeService>(ExchangeService);
    mockData = {
      from: 'USD',
      to: 'BRL',
      amount: 1,
    };
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('convertAmount()', () => {
    it('shoud be throw if services throw', async () => {
      service.convertAmount = jest
        .fn()
        .mockRejectedValue(new BadRequestException());
      await expect(controller.convertAmount(mockData)).rejects.toThrow(
        new BadRequestException(),
      );
    });

    it('shoud be call services with correct params', async () => {
      await controller.convertAmount(mockData);
      await expect(service.convertAmount).toBeCalledWith(mockData);
    });

    it('shoud be return when services return', async () => {
      const mockReturn = { amount: 1 } as ExchangeType;
      service.convertAmount = jest.fn().mockReturnValue(mockReturn);
      expect(await controller.convertAmount(mockData)).toEqual(mockReturn);
    });
  });
});
