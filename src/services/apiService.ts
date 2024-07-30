import {
  AddImagesInput,
  AddImagesResponse,
  CheckIfTgBoundInput,
  CheckIfTgBoundResponse,
  CheckIfVerifiedInput,
  CheckIfVerifiedResponse,
  CheckPointsRemainingInput,
  CheckPointsRemainingResponse,
} from "../@types";
import { ENV } from "../utils/env";
import { NetworkError } from "../utils/NetworkError";

export const addImages = async (input: AddImagesInput) => {
  try {
    const res = await fetch(
      `http://${ENV.ZAHIR_INSIGHT_URL}/trpc/imageToInvoice.addImages`,
      {
        method: "POST",
        body: JSON.stringify(input),
        headers: {
          "Content-Type": "application/json",
          "x-access-key": ENV.ZAHIR_ACCESS_KEY_ID,
          "x-secret-key": ENV.ZAHIR_SECRET_ACCESS_KEY,
        },
      },
    );

    if (res.ok) {
      const json = await res.json();
      return json as AddImagesResponse;
    }

    throw new Error("Network request failed");
  } catch (err: any) {
    console.log(`Server Error while adding images: `, err.message);
    throw err;
  }
};

export const checkIfVerified = async (input: CheckIfVerifiedInput) => {
  try {
    // throw new NetworkError("Network request failed", 203, { a: 1 });

    const res = await fetch(
      `http://${ENV.ZAHIR_INSIGHT_URL}/trpc/settings.checkIfVerified`,
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

    throw new NetworkError(
      "Check if account is verified failed",
      res.status,
      await res.json(),
    );
  } catch (err: any) {
    if (err instanceof NetworkError) {
      console.log(`Network Error: ${err.statusCode} ${err.message}`);
    } else if (err.name === "TimeoutError") {
      console.log(`TimeoutError: `, err.message);
    } else {
      console.log(`Server Error while checking if verified: `, err.message);
    }
    throw err;
  }
};

export const checkIfTgBound = async (input: CheckIfTgBoundInput) => {
  try {
    const res = await fetch(
      `http://${ENV.ZAHIR_INSIGHT_URL}/trpc/settings.checkIfTelegramAccBound`,
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
      return json as CheckIfTgBoundResponse;
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
