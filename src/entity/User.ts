import { Entity, ObjectIdColumn, Column, BaseEntity } from "typeorm";
import { IsNotEmpty } from "class-validator";

@Entity("users")
export class User extends BaseEntity {
  @ObjectIdColumn()
  id: string;

  @ObjectIdColumn({ name: 'id' })
  _id!: string;

  @Column("int", { default: 0 })
  count: number;

  @IsNotEmpty()
  @Column({ unique: true })
  email: string;

  @Column("text")
  password: string;
}
