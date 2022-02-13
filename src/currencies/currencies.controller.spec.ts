import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
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
      createCurrency: jest.fn(),
      deleteCurrency: jest.fn(),
      updateCurrency: jest.fn(),
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

  describe('createCurrency()', () => {
    it('shoud be called service with correct params', async () => {
      await controller.createCurrency(mockData);
      expect(service.createCurrency).toBeCalledWith(mockData);
    });

    it('shoud be throw when services throw', async () => {
      service.createCurrency = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());
      await expect(controller.createCurrency(mockData)).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });

    it('shoud be return when services return', async () => {
      service.createCurrency = jest.fn().mockReturnValue(mockData);
      expect(await controller.createCurrency(mockData)).toEqual(mockData);
    });
  });

  describe('deleteCurrency()', () => {
    it('shoud be throw when services throw', async () => {
      service.deleteCurrency = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());

      await expect(controller.deleteCurrency('USD')).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });

    it('shoud be called services with correct params', async () => {
      await controller.deleteCurrency('USD');
      expect(service.deleteCurrency).toBeCalledWith('USD');
    });
  });

  describe('updateCurrency()', () => {
    it('shoud be throw when services throw', async () => {
      service.updateCurrency = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());
      await expect(controller.updateCurrency('USD', 1)).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });

    it('shoud be called services with correct params', async () => {
      await controller.updateCurrency('USD', 1);
      expect(service.updateCurrency).toBeCalledWith({
        currency: 'USD',
        value: 1,
      });
    });

    it('shoud be return when services return', async () => {
      service.updateCurrency = jest.fn().mockReturnValue(mockData);
      expect(await controller.updateCurrency('USD', 1)).toEqual(mockData);
    });
  });
});
