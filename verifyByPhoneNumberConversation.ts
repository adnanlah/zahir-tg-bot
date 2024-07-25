import { Context} from "grammy";
import {
  type Conversation,
  type ConversationFlavor,
} from "@grammyjs/conversations";
import { CheckCodeResponse, VerificationInstanceResponse } from "./types";
import { FileFlavor } from "@grammyjs/files";

type MyContext = FileFlavor<Context> & ConversationFlavor;
type MyConversation = Conversation<MyContext>;

async function verifyByPhoneNumber(
  conversation: MyConversation,
  ctx: MyContext,
) {
  let phoneNumber: string = "";
  do {
    await ctx.reply("What is your phone number?");
    ctx = await conversation.wait();

    if (ctx.message?.text === "/cancel") {
      await ctx.reply("Cancelled, leaving!");
      return;
    }

    if (ctx.message?.text?.length !== 9) {
      await ctx.reply(
        "Invalid phone number! Retype it again, or `/cancel` to leave!",
      );
      continue;
    } else {
      phoneNumber = ctx.message?.text;
    }
  } while (ctx.message?.text?.length === 9);

  // .. proceed to the next step

  await ctx.reply(
    `Wait, til we verify your phone number (+213${phoneNumber})..`,
  );

  // const verification = await fetch(
  //   `http://${ENV.ZAHIR_INSIGHT_URL}/trpc/auth.verifyPhoneNumber`,
  //   {
  //     method: "POST",
  //     body: JSON.stringify({
  //       telegramId: (await ctx.getAuthor()).user.id,
  //       phoneNumber,
  //     }),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   },
  // )
  //   .then((res) => res.json() as Promise<VerificationInstanceResponse>)
  //   .catch((err) => console.log(`problem verifying phone number`, err));

  // await ctx.reply("Check if you received the code in your phone number");

  // const code = await conversation.form.number();

  // // if (!code?.text) {
  // //   await ctx.reply("ERROR: No code received!");
  // //   return;
  // // }

  // const checkCode = await fetch(
  //   `http://${ENV.ZAHIR_INSIGHT_URL}/trpc/auth.checkVerificationCode`,
  //   {
  //     method: "POST",
  //     body: JSON.stringify({
  //       telegramId: (await ctx.getAuthor()).user.id,
  //       phoneNumber,
  //       code: code,
  //     }),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   },
  // )
  //   .then((res) => res.json() as Promise<CheckCodeResponse>)
  //   .catch((err) => console.log(`problem checking code`, err));

  // console.log(checkCode);
}
