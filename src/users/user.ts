export default interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export function convertUserToView(user: User): UserView {
  return { id: user.id, email: user.email };
}

export interface UserView {
  id: User["id"];
  email: User["email"];
}
