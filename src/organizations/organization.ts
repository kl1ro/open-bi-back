import type User from "../users/user.js";

export default interface Organization {
  id: string;
  name: string;
  ownerId: User["id"];
  createdAt: Date;
}
