import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesRepository, CurrenciesService } from './currencies.service';

describe('CurrenciesService', () => {
  let service: CurrenciesService;
  let repository: CurrenciesRepository;
  let mockData;

  beforeEach(async () => {
    const currenciesRepositoryMock = {
      getCurrency: jest.fn(),
      createCurrency: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrenciesService,
        {
          provide: CurrenciesRepository,
          useFactory: () => currenciesRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CurrenciesService>(CurrenciesService);
    repository = module.get<CurrenciesRepository>(CurrenciesRepository);
    mockData = {
      currency: 'USD',
      value: 1,
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCurrency()', () => {
    it('shoud be throw if repository throw', async () => {
      (repository.getCurrency as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(),
      );
      await expect(service.getCurrency('INVALID')).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });

    it('shoud not be throw if repository returns', async () => {
      await expect(service.getCurrency('USD')).resolves.not.toThrow();
    });

    it('shoud be called repository with correct params', async () => {
      await service.getCurrency('USD');
      expect(repository.getCurrency).toBeCalledWith('USD');
    });

    it('shoud throw if value <= 0', async () => {
      mockData.value = 0;
      await expect(service.createCurrency(mockData)).rejects.toThrow(
        new BadRequestException('The value must be greater zero'),
      );
    });

    it('shoud be return when repository return', async () => {
      (repository.getCurrency as jest.Mock).mockReturnValue(mockData);
      expect(await service.getCurrency('USD')).toEqual(mockData);
    });
  });

  describe('createCurrency', () => {
    it('shoud throw if repository throw', () => {
      (repository.createCurrency as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(),
      );
      mockData.currency = 'INVALID';
      expect(service.createCurrency(mockData)).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });

    it('shoud not be throw if repository returns', () => {
      expect(service.createCurrency(mockData)).resolves.not.toThrow();
    });

    it('shoud be called repository with correct params', async () => {
      service.createCurrency(mockData);
      expect(repository.createCurrency).toBeCalledWith(mockData);
    });

    it('shoud be return when repository return', async () => {
      (repository.getCurrency as jest.Mock).mockReturnValue(mockData);
      expect(await service.getCurrency('USD')).toEqual(mockData);
    });
  });
});
