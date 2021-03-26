import { Entity, Column, BaseEntity, PrimaryColumn, IsNull } from 'typeorm';

@Entity()
export class Setting extends BaseEntity {
  @PrimaryColumn()
  settingName: string;

  @Column({ nullable: true })
  value: number;
}
