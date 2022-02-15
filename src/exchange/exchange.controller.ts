import { Controller, Get } from '@nestjs/common';
import { ExchangeService } from './exchange.service';

@Controller('exchange')
export class ExchangeController {
  constructor(private exchangeService: ExchangeService) {}

  @Get()
  async convertAmount({ from, to, amount }) {
    return await this.exchangeService.convertAmount({
      from,
      to,
      amount,
    });
  }
}
