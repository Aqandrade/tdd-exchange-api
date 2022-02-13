import { IsNotEmpty, Length } from 'class-validator';

export class UpdateCurrencyDto {
  @Length(3, 3)
  @IsNotEmpty()
  currency: string;

  @IsNotEmpty()
  value: number;
}
