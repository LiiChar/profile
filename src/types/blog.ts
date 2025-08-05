import { BlogType } from "@/db/tables/blog";
import { UserType } from "@/db/tables/user";

export type BlogWithUser = BlogType & {
  user: UserType
}