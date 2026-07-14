export type BindDeviceFieldErrors = Partial<Record<"deviceNumber", string[]>>;

export type BindDeviceSuccess = {
  success: true;
  message: string;
};

export type BindDeviceFailure = {
  success: false;
  message: string;
  fieldErrors?: BindDeviceFieldErrors;
  status?: number;
};

export type BindDeviceResponse = BindDeviceSuccess | BindDeviceFailure;
