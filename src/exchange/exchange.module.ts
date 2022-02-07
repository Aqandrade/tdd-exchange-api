import { Module } from '@nestjs/common';
import { CurrenciesModule } from 'src/currencies/currencies.module';
import { ExchangeService } from './exchange.service';

@Module({
  providers: [ExchangeService, CurrenciesModule],
})
export class ExchangeModule {}
