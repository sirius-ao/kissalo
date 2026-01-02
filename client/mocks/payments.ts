

import { PaymentStatus } from "@/types/enum";
import { IPayment } from "@/types/interfaces";
import { faker } from "@faker-js/faker";
import { mockUser } from "./users";
import { bookingsMock } from "./bookings";
import { walletsMock } from "./wallets";

export const mockPayment = (bookingId?: number): IPayment => {
  const status = faker.helpers.enumValue(PaymentStatus);

  return {
    id: faker.number.int(),
    bookingId: bookingId ?? faker.number.int(),

    amount: faker.number.float({ min: 5000, max: 50000 }),
    currency: "AOA",

    method: faker.string.alphanumeric(12).toUpperCase(),
    status,

    paidAt: status === PaymentStatus.PAID ? faker.date.recent() : undefined,
    refundedAt:
      status === PaymentStatus.REFUNDED ? faker.date.recent() : undefined,

    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    booking: bookingsMock[0],
    client: {
      firstName: faker.internet.username(),
      lastName: faker.internet.username(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatar(),
    } as any,
    professional: {
      user: {
        firstName: faker.internet.username(),
        lastName: faker.internet.username(),
        email: faker.internet.email(),
        avatarUrl: faker.image.avatar(),
      },
    } as any,
    clientId: faker.number.int(),
    professionalId: faker.number.int(),
    conclidation: {
      wallet: walletsMock[0],
    } as any,
  };
};

export const mockPayments = Array.from({ length: 10 }).map((item, idx) => {
  return mockPayment(idx);
});
