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

  async updateCurrency(
    currenciesInputType: CurrenciesInputType,
  ): Promise<Currencies> {
    const { currency, value } = currenciesInputType;
    const result = await this.findOne({ currency });
    if (!result) {
      throw new NotFoundException(`The currency ${currency} not found.`);
    }
    result.value = value;
    try {
      await this.save(result);
    } catch (error) {
      throw new InternalServerErrorException();
    }
    return result;
  }

  async deleteCurrency(currency: string): Promise<void> {
    return;
  }
}
