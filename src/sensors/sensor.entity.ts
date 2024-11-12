import { Project } from '../projects/project.entity';
import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';

@Entity()
export class Sensor {
  @PrimaryColumn({ length:200 })
  id: string;
  @Column()
  name: string;
  @Column()
  description: string;
  @ManyToOne(() => Project, project => project.sensors)
  project: Project;
}