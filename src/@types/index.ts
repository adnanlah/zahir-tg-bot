type TRPCError = {
  code: number;
  message: string;
  data: {
    code: string;
    httpStatus: number;
    stack: string;
  };
};

type Res<T> = {
  result: {
    data: T;
  };
};

type TRPCResponse<T> = Res<T> | { error: TRPCError };

type VerificationInstanceDateType = {
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
};

type CheckCodeDataType = {
  status:
    | "pending"
    | "approved"
    | "canceled"
    | "max_attempts_reached"
    | "deleted"
    | "failed"
    | "expired";
};

export type VerificationInstanceResponse =
  TRPCResponse<VerificationInstanceDateType>;

export type CheckCodeResponse = TRPCResponse<CheckCodeDataType>;

export type AddImagesInput = {
  images: { filename: string; sha256: string }[];
  telegramId: number;
};

export type AddImagesResponse = TRPCResponse<void>;

export type CheckIfVerifiedInput = {
  telegramId: number;
  phoneNumber: string;
};

export type CheckIfVerifiedResponse = {
  result: {
    data: {
      status: "verified" | "not_verified";
    };
  };
};

export type CheckPointsRemainingInput = {
  telegramId: number;
};

export type CheckPointsRemainingResponse = {
  result: {
    data: {
      pointsRemaining: number;
    };
  };
};
