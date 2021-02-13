import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { FormResponse } from './formResponse.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number; //Note: Figure out what user information we need to capture here

  @Column()
  consentForm: string; // TODO: figure out how we're storing the consent form since we aren't using qualitrics

  @OneToMany((type) => FormResponse, (formResponse) => formResponse.user)
  formResponses: FormResponse[];
}
