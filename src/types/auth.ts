import { CurrencyCode } from "./currency";
import { TransactionCategory } from "./transaction";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  defaultCurrency: CurrencyCode;
}
export interface SignupResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}
export interface SigninResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CurrentUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  defaultCurrency: CurrencyCode;
  categories: TransactionCategory[];
}

export interface CurrentUserResponse {
  success: boolean;
  data: CurrentUser;
  message: string;
}
