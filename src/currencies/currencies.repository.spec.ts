import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Currencies } from './currencies.entity';
import { CurrenciesRepository } from './currencies.repository';

describe('CurrenciesRepository', () => {
  let repository: CurrenciesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrenciesRepository],
    }).compile();

    repository = module.get<CurrenciesRepository>(CurrenciesRepository);
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
      repository.findOne = jest
        .fn()
        .mockReturnValue({ currency: 'USD', value: 1 } as Currencies);

      expect(await repository.getCurrency('USD')).toEqual({
        currency: 'USD',
        value: 1,
      });
    });
  });
});
