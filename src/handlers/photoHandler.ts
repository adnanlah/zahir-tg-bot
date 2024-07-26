import { readFileSync } from "fs";
import { nano } from "../utils/lib";
import { addImages } from "../services/apiService";
import { calculateSHA256 } from "../utils/helpers";
import { s3 } from "../services/s3Service";
import { ENV } from "../utils/env";
import { MyContext } from "..";

export const photoHandler = async (ctx: MyContext) => {
  try {
    const file = await ctx.getFile();
    const path = await file.download();
    const blob = readFileSync(path);

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
};
