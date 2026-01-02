import { IWallet } from "@/types/interfaces";
import { faker } from "@faker-js/faker";

export const walletsMock: IWallet[] = Array.from({ length: 5 }).map((_, i) => ({
  id: i + 1,
  professionalId: faker.number.int({ min: 1, max: 50 }),
  bankName: faker.helpers.arrayElement([
    "Banco BAI",
    "BFA",
    "Banco Atlântico",
    "Standard Bank",
  ]),
  accountNumber: faker.finance.accountNumber(12),
  accountHolder: faker.person.fullName(),
  isActive: faker.datatype.boolean(),
  isVerified: faker.datatype.boolean(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  professional: null as any, // geralmente vem via backend
  conclidation: [],
}));
