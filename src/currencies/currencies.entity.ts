import {
  Column,
  Entity,
  ObjectIdColumn,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Unique(['currency'])
@Entity()
export class Currencies {
  @ObjectIdColumn()
  _id: string;

  @PrimaryColumn()
  currency: string;

  @Column()
  value: number;

  @UpdateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: Date;
}
