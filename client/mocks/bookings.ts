

import {
  BookingPriority,
  BookingStatus,
  PaymentStatus,
  ServiceLocation,
} from "@/types/enum";
import { IBooking } from "@/types/interfaces";
import { faker } from "@faker-js/faker";

export const bookingsMock: IBooking[] = Array.from({ length: 10 }).map(
  (_, i) => {
    const scheduleDate = new Date();
    const startTime = new Date();
    const endTime = new Date(startTime);

    const statuses = Object.values(BookingStatus);
    const payments = Object.values(PaymentStatus);
    const priorities = Object.values(BookingPriority);
    const locations = Object.values(ServiceLocation);

    return {
      id: i + 1,
      clientId: faker.number.int(),
      professionalId: faker.number.int(),
      serviceId: 1,
      canEnd: faker.datatype.boolean(),
      scheduleDate,
      startTime,
      endTime,
      location: faker.helpers.arrayElement(locations),
      address: {
        city: "Luanda",
        district: "Viana",
      },
      priority: faker.helpers.arrayElement(priorities),
      status: faker.helpers.arrayElement(statuses),
      paymentStatus: faker.helpers.arrayElement(payments),
      totalAmount: faker.number.int({ min: 1000 }),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      canceledAt: undefined,
      cancelReason: undefined,
      completedAt:
        faker.datatype.boolean() &&
        faker.helpers.arrayElement([
          BookingStatus.COMPLETED,
          BookingStatus.CONFIRMED,
        ])
          ? new Date(scheduleDate)
          : undefined,
      client: {
        firstName: faker.internet.username(),
        lastName: faker.internet.username(),
        email: faker.internet.email(),
        avatarUrl: faker.image.avatar(),
      } as any,
      professional: {
        firstName: faker.internet.username(),
        lastName: faker.internet.username(),
        email: faker.internet.email(),
        avatarUrl: faker.image.avatar(),
      } as any,
      service: {
        title: faker.helpers.arrayElement([
          "Criação de sites",
          "Design Gráfico",
          "Marketing Digital",
          "Consultoria Empresarial",
          "Desenvolvimento de App",
          "Fotografia Profissional",
        ]),
      } as any,
      steps: [],
    };
  }
);

import { IBookingSteps } from "@/types/interfaces";

export function generateBookingSteps(
  bookingId: number,
  userId: number
): IBookingSteps[] {
  const stepsCount = faker.number.int({ min: 1, max: 5 });

  return Array.from({ length: stepsCount }, (_, i) => ({
    id: faker.number.int(),
    bookingId,
    senderId: userId,
    notes: faker.lorem.sentences(2),
    files: faker.datatype.boolean() ? [faker.internet.url()] : [],
    createdAt: faker.date.recent(),

    booking: undefined as any,
    user: undefined as any,
  }));
}
