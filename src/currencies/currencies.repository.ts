import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { EntityRepository, Repository } from 'typeorm';
import { Currencies } from './currencies.entity';
import { CurrenciesInputType } from './types/currencies-input.type';
@EntityRepository(Currencies)
export class CurrenciesRepository extends Repository<Currencies> {
  async getCurrency(currency: string): Promise<Currencies> {
    const result = await this.findOne({ currency });
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  async createCurrency(
    currenciesInputType: CurrenciesInputType,
  ): Promise<Currencies> {
    const { currency, value } = currenciesInputType;
    const createCurrency = new Currencies();
    createCurrency.currency = currency;
    createCurrency.value = value;
    try {
      await validateOrReject(createCurrency);
      await this.save(createCurrency);
      return createCurrency;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async updateCurrency({
    currency,
    value,
  }: CurrenciesInputType): Promise<Currencies> {
    return new Currencies();
  }

  async deleteCurrency(currency: string): Promise<void> {
    return;
  }
}
