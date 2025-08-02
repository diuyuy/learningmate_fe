import type { Article } from "@/features/articles/types/types";
import type { User } from "@/features/users/types/types";

export type Review = {
  id: number;
  article: Article;
  user: User;
  content1: string;
  content2: string;
  content3: string;
  createdAt: string;
  updatedAt: string;
};

export type LikeReview = {
  id: number;
  review: Review;
  user: User;
};
