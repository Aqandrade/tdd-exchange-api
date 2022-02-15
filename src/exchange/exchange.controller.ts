import { Controller, Get } from '@nestjs/common';
import { ConvertAmountDto } from './dto/convert-amount.dto';
import { ExchangeService } from './exchange.service';

@Controller('exchange')
export class ExchangeController {
  constructor(private exchangeService: ExchangeService) {}

  @Get()
  async convertAmount(convertAMountDto: ConvertAmountDto) {
    return await this.exchangeService.convertAmount(convertAMountDto);
  }
}
