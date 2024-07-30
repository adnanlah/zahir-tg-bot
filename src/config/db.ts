import { MikroORM } from "@mikro-orm/core";
import { Options } from "@mikro-orm/core";
import type { MongoDriver } from "@mikro-orm/mongodb";
import config from "../../mikro-orm.config";

export let orm: MikroORM<MongoDriver>;

export const initORM = async (): Promise<void> => {
  try {
    orm = await MikroORM.init<MongoDriver>({
      ...config,
    } as unknown as Options<MongoDriver>);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log("=== error connecting to database ====", err.message);

    throw err;
  }
};
