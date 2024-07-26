import { Keyboard } from "grammy";

export const keyboard = new Keyboard()
  .text("تسجيل دخول")
  .row()
  .text("عرض عدد النقاط المتبقية")
  .row()
  .text("اضافة نقاط اضافية")
  .row()
  .resized();
