import {
  Api,
  Bot,
  Context,
  GrammyError,
  HttpError,
  session,
  SessionFlavor,
} from "grammy";
import { FileApiFlavor, FileFlavor, hydrateFiles } from "@grammyjs/files";

import { ENV } from "./utils/env";
import {
  type Conversation,
  type ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import { loginMenu } from "./menus/loginMenu";
import { photoHandler } from "./handlers/photoHandler";
import { verifyByPhoneNumber } from "./conversations/verifyByPhoneNumberConversation";
import { loginCommand } from "./commands/login";
import { startCommand } from "./commands/start";
import { pointsCommand } from "./commands/points";
import { errorHandler } from "./handlers/errorHandler";

export type SessionData = {
  phoneNumber: string;
  code: string;
};

export type MyContext = FileFlavor<Context> &
  ConversationFlavor &
  SessionFlavor<SessionData>;
export type MyConversation = Conversation<MyContext>;
export type MyApi = FileApiFlavor<Api>;

export const bot = new Bot<MyContext, MyApi>(ENV.BOT_TOKEN);

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

// conversations
bot.use(conversations());

bot.use(createConversation(verifyByPhoneNumber));

// menus
bot.use(loginMenu);

// commands
bot.command("login", loginCommand);

bot.command("start", startCommand);

bot.command("points", pointsCommand);

// files upload
bot.api.config.use(hydrateFiles(bot.token));

bot.on([":photo"], photoHandler);

// error handling
bot.catch(errorHandler);

// drop pending updates
(async function () {
  await bot.api.deleteWebhook({ drop_pending_updates: true });
})();
