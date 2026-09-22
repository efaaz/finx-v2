export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  refreshToken?: string | null;
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