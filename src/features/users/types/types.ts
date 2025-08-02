export type User = {
  id: number;
  email: string;
  nickname: string;
  passwordHash?: string;
  imageUrl?: string;
  createdAt: string; // ISO Timestamp
  updatedAt: string;
};
