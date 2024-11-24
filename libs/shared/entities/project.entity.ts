import { Sensor, ISensor } from './sensor.entity';
import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';

export interface IProject {
  id?: string;
  name?: string;
  description?: string;
  sensors?: ISensor[];
  topic?: string
}

@Entity()
export class Project implements IProject {
  @PrimaryColumn({ length:200 })
  id: string;
  @Column()
  name: string;
  @Column()
  description: string;
  @OneToMany(() => Sensor, sensor => sensor.project)
  sensors: Sensor[];
  @Column()
  topic: string
}
