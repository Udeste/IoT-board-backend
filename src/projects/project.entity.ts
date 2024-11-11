import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Project {
  @PrimaryColumn({ length:200 })
  id: string;
  @Column()
  name: string;
  @Column()
  description: string;
  // @OneToMany(type => Photo, photo => photo.user)
//   sensors: Sensor[];
}
