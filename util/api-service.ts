import { ENV } from "./env";

type AddImagesInput = {
  images: { filename: string; sha256: string }[];
  telegramId: string;
};

export const addImages = async (input: AddImagesInput) => {
  try {
    const res = await fetch(
      `http://${ENV.ZAHIR_INSIGHT_URL}/trpc/imageToInvoice.addImages`,
      {
        method: "POST",
        body: JSON.stringify(input),
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${jwtToken}`,
        },
      },
    );

    if (res.ok) {
      const json = await res.json();
      return json;
    }

    throw new Error("Network request failed");
  } catch (err: any) {
    console.log(`Server Error while adding images: `, err.message);
  }
};
