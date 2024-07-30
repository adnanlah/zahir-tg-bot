export type TRPCError = {
  code: number;
  message: string;
  data: {
    code: string;
    httpStatus: number;
    stack: string;
  };
};

export type Res<T> = {
  result: {
    data: T;
  };
};

export type TRPCResponse<T> = Res<T> | { error: TRPCError };
