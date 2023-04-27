import { CustomError } from "src/lib/utils/CustomError";

export interface ApiResponse<T> {
  status: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export type MessagingResponse<T> = [T | null, CustomError | null];
