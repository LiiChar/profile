import { UserType } from "@/db/tables/user";

export const isAdmin = (user?: Pick<UserType, 'isAdmin'> | null) => {
  if (!user) return false;
return user.isAdmin;
};