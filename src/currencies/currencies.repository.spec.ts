import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesRepository } from './currencies.repository';

describe('CurrenciesRepository', () => {
  let repository: CurrenciesRepository;
  let mockData;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrenciesRepository],
    }).compile();

    repository = module.get<CurrenciesRepository>(CurrenciesRepository);
    mockData = { currency: 'USD', value: 1 };
  });

  it('shoud be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getCurrency()', () => {
    it('shoud be called findOne with correct params', async () => {
      repository.findOne = jest.fn().mockReturnValue('USD');
      await repository.getCurrency('USD');
      expect(repository.findOne).toBeCalledWith({ currency: 'USD' });
    });

    it('shoud be throw if findOne return empty', async () => {
      repository.findOne = jest.fn().mockReturnValue(undefined);
      await expect(repository.getCurrency('USD')).rejects.toThrow(
        new NotFoundException(),
      );
    });

    it('shoud be throw if findOne throws', async () => {
      repository.findOne = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());

      await expect(repository.getCurrency('USD')).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });

    it('shoud return when findOne returns', async () => {
      repository.findOne = jest.fn().mockReturnValue(mockData);

      expect(await repository.getCurrency('USD')).toEqual({
        currency: 'USD',
        value: 1,
      });
    });
  });

  describe('createCurrency()', () => {
    beforeEach(() => {
      repository.save = jest.fn();
    });

    it('shoud be called save with correct params', async () => {
      repository.save = jest.fn().mockReturnValue(mockData);
      await repository.createCurrency(mockData);
      expect(repository.save).toBeCalledWith(mockData);
    });

    it('shoud be throw if save throw', async () => {
      repository.save = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());
      mockData.currency = 'INVALID';

      await expect(repository.createCurrency(mockData)).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });

    it('shoud be throw if called with invalid params', async () => {
      mockData.currency = 'INVALID';
      await expect(repository.createCurrency(mockData)).rejects.toThrow();

      mockData.currency = 'USD';
      mockData.value = 'INVALID';
      await expect(repository.createCurrency(mockData)).rejects.toThrow();
    });

    it('shoud be created data', async () => {
      expect(await repository.createCurrency(mockData)).toEqual(mockData);
    });
  });
});
