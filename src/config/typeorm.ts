import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Currencies } from 'src/currencies/currencies.entity';

export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  url: 'mongodb://localhost/exchange',
  entities: [Currencies],
  synchronize: true,
  useUnifiedTopology: true,
};
