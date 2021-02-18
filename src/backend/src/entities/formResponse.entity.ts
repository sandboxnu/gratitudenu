import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import { Question } from './question.entity';
import { User } from './user.entity';

@Entity()
export class FormResponse extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.formResponses)
  user: User;

  @OneToOne((type) => Question)
  @JoinColumn()
  question: Question;

  @Column()
  answer: string;
}
