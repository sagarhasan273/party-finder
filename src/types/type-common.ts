export type ResponseSuccess = {
  status: boolean;
  message: string;
  data: any;
  metaData?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};
export type ResponseError = {
  status: boolean;
  message: string;
  data?: any;
};

export type ResponseType = ResponseSuccess | ResponseError;
