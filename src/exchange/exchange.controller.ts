import { Controller, Get, Query } from '@nestjs/common';
import { ConvertAmountDto } from './dto/convert-amount.dto';
import { ExchangeService } from './exchange.service';
import { ExchangeType } from './types/exchange.type';

@Controller('exchange')
export class ExchangeController {
  constructor(private exchangeService: ExchangeService) {}

  @Get()
  async convertAmount(
    @Query() convertAMountDto: ConvertAmountDto,
  ): Promise<ExchangeType> {
    return await this.exchangeService.convertAmount(convertAMountDto);
  }
}
