import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
