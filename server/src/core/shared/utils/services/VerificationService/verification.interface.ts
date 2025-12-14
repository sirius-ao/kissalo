
import { User, VerificationsType } from "@prisma/client";

export interface IVerificationService {
  verify(token: string): Promise<void>;
  create(user: User, type: VerificationsType): Promise<void>;
}
