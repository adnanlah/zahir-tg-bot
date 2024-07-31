import { TRPCResponse } from "./trpcTypes";

export type VerifyPhoneNumberInput = {
  telegramId: number;
  phoneNumber: string;
};

export type VerificationInstanceResponse = TRPCResponse<{
  sid: string;
  service_sid: string;
  account_sid: string;
  to: string;
  channel: string;
  status: string;
  valid: boolean;
  date_created: string;
  date_updated: string;
  amount: any;
  payee: any;
  sna: any;
  url: string;
}>;

export type CheckVerificationCodeInput = {
  telegramId: number;
  phoneNumber: string;
  code: string;
};

export type CheckCodeResponse = TRPCResponse<{
  status:
    | "pending"
    | "approved"
    | "canceled"
    | "max_attempts_reached"
    | "deleted"
    | "failed"
    | "expired";
}>;

export type AddImagesInput = {
  images: { filename: string; sha256: string }[];
  telegramId: number;
};

export type AddImagesResponse = TRPCResponse<void>;

export type CheckIfVerifiedInput = {
  telegramId: number;
  phoneNumber: string;
};

export type CheckIfVerifiedResponse = TRPCResponse<{
  status: "verified" | "not_verified";
}>;

export type CheckIfTgBoundInput = {
  telegramId: number;
};

export type CheckIfTgBoundResponse = TRPCResponse<{
  status: "bound" | "not_bound";
}>;

export type CheckPointsRemainingInput = {
  telegramId: number;
};

export type CheckPointsRemainingResponse = TRPCResponse<{
  pointsRemaining: number;
}>;
