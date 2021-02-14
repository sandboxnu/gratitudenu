import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { FormResponse } from './formResponse.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => FormResponse)
  @JoinColumn()
  formResponse: FormResponse;

  @Column()
  prompt: string;
}
