export interface User {
  email: string;
  user_id: string;
  full_name: string;
  picture_url: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface SignupDto {
  email: string;
  full_name: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface ExtensionLoginResponse {
  access_token: string;
  refresh_token: string;
}
