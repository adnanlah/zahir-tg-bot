import { MyContext } from "../bot";
import { checkPointsRemaining } from "../services/apiService";

export const pointsCommand = async (ctx: MyContext) => {
  const points = await checkPointsRemaining({
    telegramId: (await ctx.getAuthor()).user.id,
  });

  await ctx.reply(`Remaining points: ${points.result.data.pointsRemaining}`);
};
