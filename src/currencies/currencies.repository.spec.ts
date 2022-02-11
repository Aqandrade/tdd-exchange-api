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
    repository.findOne = jest.fn();
    repository.save = jest.fn();
    repository.delete = jest.fn();
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

  describe('updateCurrency()', () => {
    it('shoud be called findOne with correct params', async () => {
      repository.findOne = jest.fn().mockReturnValue(mockData);
      await repository.updateCurrency(mockData);
      expect(repository.findOne).toBeCalledWith({
        currency: mockData.currency,
      });
    });

    it('shoud be throw if findOne returns empty', async () => {
      repository.findOne = jest.fn().mockReturnValue(undefined);
      await expect(repository.updateCurrency(mockData)).rejects.toThrow(
        new NotFoundException(`The currency ${mockData.currency} not found.`),
      );
    });

    it('shoud be called save with correct params', async () => {
      repository.findOne = jest.fn().mockReturnValue(mockData);
      repository.save = jest.fn().mockReturnValue(mockData);
      await repository.updateCurrency(mockData);
      expect(repository.save).toBeCalledWith(mockData);
    });

    it('shoud throw if save throws', async () => {
      repository.findOne = jest.fn().mockReturnValue(mockData);
      repository.save = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());

      await expect(repository.updateCurrency(mockData)).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });

    it('shoud be return updated data', async () => {
      repository.findOne = jest.fn().mockReturnValue(mockData);
      mockData.value = 2;
      repository.save = jest.fn().mockReturnValue(mockData);
      expect(await repository.updateCurrency(mockData)).toEqual(mockData);
    });
  });

  describe('deleteCurrency()', () => {
    it('shoud be call findOne with correct params', async () => {
      repository.findOne = jest.fn().mockReturnValue(mockData);
      await repository.deleteCurrency(mockData.currency);
      expect(repository.findOne).toBeCalledWith({
        currency: mockData.currency,
      });
    });

    it('shoud be throw if findOne throw', async () => {
      repository.findOne = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());
      await expect(
        repository.deleteCurrency(mockData.currency),
      ).rejects.toThrow(new InternalServerErrorException());
    });

    it('shoud be throw if findOne returns empty', async () => {
      repository.findOne = jest.fn().mockReturnValue(undefined);
      await expect(
        repository.deleteCurrency(mockData.currency),
      ).rejects.toThrow(
        new NotFoundException(`The currency ${mockData.currency} not found`),
      );
    });

    it('shoud be call delete with correct params', async () => {
      repository.findOne = jest.fn().mockReturnValue(mockData);
      await repository.deleteCurrency(mockData.currency);
      await expect(repository.delete).toBeCalledWith({
        currency: mockData.currency,
      });
    });

    it('shoud throw if delete throws', async () => {
      repository.findOne = jest.fn().mockReturnValue({});
      repository.delete = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException());
      await expect(
        repository.deleteCurrency(mockData.currency),
      ).rejects.toThrow(new InternalServerErrorException());
    });
  });
});
