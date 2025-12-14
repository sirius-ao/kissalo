import { User } from '@prisma/client';

export interface ILoginUseCase {
  unique: string;
  password: string;
}
export interface ILoginUseCaseReturnType {
  user: User;
}
