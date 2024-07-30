/* eslint-disable prettier/prettier */
import { Entity, Property } from "@mikro-orm/core";
import { CustomBaseEntity } from "./CustomBase";

@Entity()
export class Log extends CustomBaseEntity {
  @Property()
  description!: string;

  @Property()
  type!: string;
}

export interface LogEntity extends Log {}
