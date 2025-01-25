export interface UserInput {
    username: string;
    email: string;
    password: string;
  }
  
  export interface LoginInput {
    email: string;
    password: string;
  }
  
  export interface JWTPayload {
    userId: string;
    email: string;
    id?: string;
  }