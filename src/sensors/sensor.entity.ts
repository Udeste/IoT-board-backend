import { IProject, Project } from '../projects/project.entity';
import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';

export interface ISensor {
  id: string;
  name: string;
  description: string;
  project: IProject;
  tags: { [key: string]: string },
  measurements: Array<string>
}

@Entity()
export class Sensor implements ISensor {
  @PrimaryColumn({ length:200 })
  id: string;
  @Column()
  name: string;
  @Column()
  description: string;
  @ManyToOne(() => Project, project => project.sensors, { onDelete: 'CASCADE' })
  project: Project;
  @Column({ type: "json"})
  tags: { [key: string]: string }
  @Column('simple-array')
  measurements: Array<string>;
}