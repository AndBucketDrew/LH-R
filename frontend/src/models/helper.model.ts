interface DecodedToken {
  id: string;
  [key: string]: any;
}

interface ApiResponse<T> {
  status: number;
  data: T;
}

interface ApiError {
  response?: {
    data: {
      message?: string;
    };
  };
  message: string;
}

interface Alert {
  text: string;
  severity: string;
  title?: string;
}

export type { DecodedToken, ApiResponse, ApiError, Alert };
