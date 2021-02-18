import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { FormResponse } from './formResponse.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number; //Note: Figure out what user information we need to capture here

  @Column()
  consentFormFilled: boolean;

  @OneToMany((type) => FormResponse, (formResponse) => formResponse.user)
  formResponses: FormResponse[];
}
