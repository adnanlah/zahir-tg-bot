import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectId } from "mongodb";

@Entity()
export abstract class CustomBaseEntity {
  @PrimaryKey()
  _id!: ObjectId;

  @Property()
  createdAt?: Date = new Date();

  @Property({
    onUpdate: () => new Date(),
  })
  updatedAt?: Date = new Date();
}
