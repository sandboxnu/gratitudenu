import { Entity, Column, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity()
export class Setting extends BaseEntity {
  @PrimaryColumn()
  settingName: string;

  @Column()
  value: number;
}
