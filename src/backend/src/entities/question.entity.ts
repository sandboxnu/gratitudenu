import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { FormResponse } from './formResponse.entity';

@Entity()
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => FormResponse)
  @JoinColumn()
  formResponse: FormResponse;

  @Column()
  prompt: string;
}
