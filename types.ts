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
  | Res<VerificationInstanceDateType>
  | {
      error: TRPCError;
    };

export type CheckCodeResponse =
  | Res<CheckCodeDataType>
  | {
      error: TRPCError;
    };
