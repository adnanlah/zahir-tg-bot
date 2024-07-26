import { MyContext } from "..";
import { keyboard } from "../menus/keyboard";

export const startCommand = async (ctx: MyContext) => {
  await ctx.reply("مرحبا بك في بوت برنامج Zahir لتسيير المحلات", {
    reply_markup: keyboard,
  });
};
