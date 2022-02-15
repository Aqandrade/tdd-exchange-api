import { IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class UpdateCurrencyDto {
  @Length(3, 3)
  @IsNotEmpty()
  currency: string;

  @IsNotEmpty()
  @IsNumberString()
  value: number;
}
