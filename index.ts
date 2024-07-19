import { Api, Bot, Context } from "grammy";
import { FileApiFlavor, FileFlavor, hydrateFiles } from "@grammyjs/files";

import { readFileSync } from "fs";
import { S3 } from "aws-sdk";
import { ENV } from "./util/env";
import { Menu } from "@grammyjs/menu";
import { customAlphabet } from "nanoid";

const nano = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 20);

type MyContext = FileFlavor<Context>;
type MyApi = FileApiFlavor<Api>;

const bot = new Bot<MyContext, MyApi>(ENV.BOT_TOKEN as string);

const menu = new Menu("my-menu-identifier")
  .text("A", (ctx) => ctx.reply("You pressed A!"))
  .row()
  .text("B", (ctx) => ctx.reply("You pressed B!"));

bot.use(menu);

bot.command("start", async (ctx) => {
  await ctx.reply("Check out this menu:", { reply_markup: menu });
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

    // console.log(await s3.listObjects({ Bucket: "zahir" }).promise());

    const uploadedImage = await s3
      .upload({
        Bucket: ENV.CLOUDFLARE_BUCKET_NAME,
        Key: nano() + ".png",
        Body: blob,
      })
      .promise();

    // await fetch(
    //   `http://${ENV.ZAHIR_INSIGHT_URL}/trpc/imageToInvoice.addImages`,
    //   {
    //     method: "POST",
    //     body: JSON.stringify({
    //       images: [
    //         {
    //           filename: uploadedImage.Key,
    //           sha256: uploadedImage.Key,
    //           userId: `QWE`,
    //         },
    //       ],
    //     }),
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${jwtToken}`,
    //     },
    //   },
    // );

    console.log(
      "File uploaded successfullt ",
      uploadedImage.Location,
      uploadedImage.Key,
    );
  } catch (error: any) {
    console.log(error.message);
  }
});

bot.start();
