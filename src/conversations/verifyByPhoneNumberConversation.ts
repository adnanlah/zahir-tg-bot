import { CheckCodeResponse, VerificationInstanceResponse } from "../@types";
import { checkIfVerified } from "../services/apiService";
import { ENV } from "../utils/env";
import { MyContext, MyConversation } from "..";

export async function verifyByPhoneNumber(
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

    const res = await conversation.external(async () =>
      checkIfVerified({
        telegramId: Number(telegramId),
        phoneNumber,
      }),
    );

    if (res?.result.data.status === "verified") {
      await ctx.reply("حساب التلغرام الخاص بك مرتبط بالفعل بخدماتنا.");
      return;
    }

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
