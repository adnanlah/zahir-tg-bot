import { Api, Bot, Context, Keyboard, session, SessionFlavor } from "grammy";
import { FileApiFlavor, FileFlavor, hydrateFiles } from "@grammyjs/files";

import { readFileSync } from "fs";
import { S3 } from "aws-sdk";
import { ENV } from "./util/env";
import { Menu } from "@grammyjs/menu";
import {
  type Conversation,
  type ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import { CheckCodeResponse, VerificationInstanceResponse } from "./types";
import { nano } from "./util/lib";
import { calculateSHA256 } from "./util/helpers";
import { addImages } from "./util/api-service";

type MyContext = FileFlavor<Context> &
  ConversationFlavor &
  SessionFlavor<SessionData>;
type MyConversation = Conversation<MyContext>;
type MyApi = FileApiFlavor<Api>;

const bot = new Bot<MyContext, MyApi>(ENV.BOT_TOKEN as string);

type SessionData = {
  phoneNumber: string;
  code: string;
};

bot.use(
  session({
    initial() {
      return {
        phoneNumber: "",
        code: "",
      };
    },
  }),
);

bot.use(conversations());

bot.use(createConversation(verifyByPhoneNumber));

async function verifyByPhoneNumber(
  conversation: MyConversation,
  ctx: MyContext,
) {
  try {
    const telegramId = (await ctx.getAuthor()).user.id;

    do {
      await ctx.reply("ما هو رقم هاتفك؟");
      ctx = await conversation.wait();

      if (ctx.message?.text === "/cancel") {
        await ctx.reply("تم الإلغاء!");
        return;
      }

      if (ctx.message?.text?.length !== 10) {
        await ctx.reply(
          "رقم الهاتف غير صالح! أعد كتابته مرة أخرى، أو `/cancel` للمغادرة!",
        );
        continue;
      } else {
        ctx.session.phoneNumber = ctx.message?.text;
      }
    } while (ctx.message?.text?.length !== 10);

    const { phoneNumber } = ctx.session;

    await ctx.reply(`انتظر، حتى نتحقق من رقم هاتفك (+213${phoneNumber})..`);

    const verifyResponse = await conversation.external(async () => {
      try {
        return await fetch(
          `http://${ENV.ZAHIR_INSIGHT_URL}/trpc/auth.verifyPhoneNumber`,
          {
            method: "POST",
            body: JSON.stringify({
              telegramId,
              phoneNumber,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          },
        ).then((res) => res.json() as Promise<VerificationInstanceResponse>);
      } catch (err: any) {
        return null;
      }
    });

    if (!verifyResponse) {
      await ctx.reply(
        `مشكلة في الاتصال بالخادم، يرجى المحاولة مرة أخرى لاحقاً!`,
      );
      return;
    }

    if ("error" in verifyResponse) {
      console.log(
        `Error in verification res.error.message: `,
        verifyResponse.error.message,
      );
      await ctx.reply(
        `مشكلة في التحقق من رقم الهاتف، يرجى المحاولة مرة أخرى لاحقاً! ${verifyResponse.error.message}`,
      );
      return;
    }

    do {
      await ctx.reply("تحقق مما إذا كنت قد تلقيت الرمز في رقم هاتفك");
      ctx = await conversation.wait();

      if (ctx.message?.text === "/cancel") {
        await ctx.reply("تم الإلغاء!");
        return;
      }

      if (ctx.message?.text?.length !== 4) {
        await ctx.reply(
          "رمز غير صالح! أعد كتابته مرة أخرى، أو `/cancel` للمغادرة!",
        );
        continue;
      } else {
        ctx.session.code = ctx.message?.text;
      }
    } while (ctx.message?.text?.length !== 4);

    const checkCodeResponse = await conversation.external(async () => {
      try {
        return await fetch(
          `http://${ENV.ZAHIR_INSIGHT_URL}/trpc/auth.checkVerificationCode`,
          {
            method: "POST",
            body: JSON.stringify({
              telegramId,
              phoneNumber,
              code: ctx.session.code,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          },
        ).then((res) => res.json() as Promise<CheckCodeResponse>);
      } catch (err: any) {
        return null;
      }
    });

    if (!checkCodeResponse) {
      await ctx.reply(
        `مشكلة في الاتصال بالخادم، يرجى المحاولة مرة أخرى لاحقاً!`,
      );
      return;
    }

    if ("error" in checkCodeResponse) {
      await ctx.reply(
        `مشكلة في التحقق من رقم الهاتف، يرجى المحاولة مرة أخرى لاحقاً! ${checkCodeResponse.error.message}`,
      );
    } else {
      const {
        result: {
          data: { status },
        },
      } = checkCodeResponse;

      if (status === "approved") {
        await ctx.reply("تم التحقق بنجاح!");
        return;
      } else {
        await ctx.reply(`فشل في التحقق! ${status}`);
      }
    }
    return;
  } catch (err: any) {
    console.log(`Error in verifyByPhoneNumber conversation: `, err.message);
  }
}

const menu = new Menu<MyContext>("my-menu-identifier")
  .text("E-Mail", (ctx) => {
    ctx.reply("You pressed A!");
  })
  .row()
  .text(
    "Phone number",
    async (ctx) => await ctx.conversation.enter("verifyByPhoneNumber"),
  );

bot.use(menu);

const keyboard = new Keyboard()
  .text("تسجيل دخول")
  .row()
  .text("عرض عدد النقاط المتبقية")
  .row()
  .text("اضافة نقاط اضافية")
  .row()
  .resized();

bot.command("login", async (ctx) => {
  await ctx.reply("Check out this menu:", { reply_markup: menu });
});

bot.command("start", async (ctx) => {
  await ctx.reply("مرحبا بك في بوت برنامج Zahir لتسيير المحلات", {
    reply_markup: keyboard,
  });
});

bot.api.config.use(hydrateFiles(bot.token));

bot.on([":photo"], async (ctx) => {
  try {
    const file = await ctx.getFile();
    const path = await file.download();
    const blob = readFileSync(path);

    const s3 = new S3({
      endpoint: ENV.CLOUDFLARE_ENDPOINT,
      accessKeyId: ENV.CLOUDFLARE_ACCESS_KEY_ID,
      secretAccessKey: ENV.CLOUDFLARE_SECRET_ACCESS_KEY,
      signatureVersion: "v4",
    });

    const uploadedImage = await s3
      .upload({
        Bucket: ENV.CLOUDFLARE_BUCKET_NAME,
        Key: nano() + ".png",
        Body: blob,
      })
      .promise();

    await addImages({
      images: [
        {
          filename: uploadedImage.Key,
          sha256: calculateSHA256(blob),
        },
      ],
      telegramId: `QWE`,
    });

    console.log(
      "File uploaded successfully ",
      uploadedImage.Location,
      uploadedImage.Key,
    );
  } catch (error: any) {
    console.log(`global error: `, error.message);
  }
});

bot.start();

(async function () {
  await bot.api.deleteWebhook({ drop_pending_updates: true });
})();
