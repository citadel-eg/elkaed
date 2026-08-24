export interface AdminSessionData {
  isLoggedIn: boolean;
  username: string;
  loginAt?: string;
}

export const defaultSession: AdminSessionData = {
  isLoggedIn: false,
  username: '',
};
