import { UserType } from "@/db/tables/user";

export const isAdmin = (user?: UserType | null) => {
  if (!user) return false;
	return user.isAdmin;
};