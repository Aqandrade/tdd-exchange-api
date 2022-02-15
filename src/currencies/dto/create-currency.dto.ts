import { IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class CreateCurrencyDto {
  @Length(3, 3)
  @IsNotEmpty()
  currency: string;

  @IsNotEmpty()
  @IsNumberString()
  value: number;
}
