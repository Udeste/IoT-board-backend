import { Sensor } from '../sensors/sensor.entity';
import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';

@Entity()
export class Project {
  @PrimaryColumn({ length:200 })
  id: string;
  @Column()
  name: string;
  @Column()
  description: string;
  @OneToMany(() => Sensor, sensor => sensor.project)
  sensors: Sensor[];
}
