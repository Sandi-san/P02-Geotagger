//Structure for passing type of User
export type UserType = {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  image?: string;
  guessTokens: number;
};
//Structure for passing User for update
export type UpdateUserType = {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  image?: string;
  password?: string;
  old_password?: string;
  confirm_password?: string;
};

