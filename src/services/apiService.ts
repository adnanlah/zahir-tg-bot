import {
  AddImagesInput,
  CheckIfVerifiedInput,
  CheckIfVerifiedResponse,
  CheckPointsRemainingInput,
  CheckPointsRemainingResponse,
} from "../@types";
import { ENV } from "../utils/env";

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

export const checkIfVerified = async (input: CheckIfVerifiedInput) => {
  try {
    const res = await fetch(
      `http://${ENV.ZAHIR_INSIGHT_URL}/trpc/auth.checkIfVerified`,
      {
        method: "POST",
        body: JSON.stringify(input),
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(10000),
      },
    );

    if (res.ok) {
      const json = await res.json();
      return json as CheckIfVerifiedResponse;
    }

    throw new Error("Network request failed");
  } catch (err: any) {
    if (err.name === "TimeoutError") {
      console.log(`TimeoutError: `, err.message);
    } else {
      console.log(`Server Error while checking if verified: `, err.message);
    }
    throw err;
  }
};

export const checkPointsRemaining = async (
  input: CheckPointsRemainingInput,
) => {
  try {
    const res = await fetch(
      `http://${ENV.ZAHIR_INSIGHT_URL}/trpc/imageToInvoice.checkPointsRemaining`,
      {
        method: "POST",
        body: JSON.stringify(input),
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(10000),
      },
    );

    if (res.ok) {
      const json = await res.json();
      return json as CheckPointsRemainingResponse;
    }

    throw new Error("Network request failed");
  } catch (err: any) {
    if (err.name === "TimeoutError") {
      console.log(`TimeoutError: `, err.message);
    } else {
      console.log(
        `Server Error while checking points remaining: `,
        err.message,
      );
    }
    throw err;
  }
};
