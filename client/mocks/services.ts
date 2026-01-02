const fakeImage = () =>
  `https://picsum.photos/seed/${faker.string.uuid()}/800/600`;
import { faker } from "@faker-js/faker";
import { IServiceTemplate } from "@/types/interfaces";
import { categoriesMock } from "./categories";
import { ServicePriceType } from "@/types/enum";

export function generateServiceMock(
  id: number,
  categoryIndex: number
): IServiceTemplate {
  return {
    id,
    categoryId: categoriesMock[categoryIndex].id,
    title: faker.commerce.productName(),
    shortDescription: faker.commerce.productDescription(),
    description: faker.lorem.paragraphs(2),
    deliverables: faker.lorem.sentence(),
    slug: faker.helpers.slugify(faker.commerce.productName().toLowerCase()),
    keywords: faker.lorem.words(3).split(" "),
    requirements: [faker.lorem.words(2), faker.lorem.words(3)],
    gallery: [fakeImage(), fakeImage()],
    videoUrl: faker.internet.url(),
    bannerUrl: fakeImage(),
    isNegotiable: faker.datatype.boolean(),
    requiresApproval: faker.datatype.boolean(),
    price: faker.number.int({ min: 5000, max: 80000 }),
    currency: "AOA",
    duration: faker.number.int({ min: 30, max: 300 }),
    isActive: faker.datatype.boolean(),
    isFeatured: faker.datatype.boolean(),
    maxRequestsPerDay: faker.number.int({ min: 1, max: 10 }),
    maxBookings: faker.number.int({ min: 5, max: 30 }),
    viewsCount: faker.number.int({ min: 100, max: 5000 }),
    bookingsCount: faker.number.int({ min: 10, max: 1000 }),
    ratingAverage: Number(
      faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 })
    ),
    ratingCount: faker.number.int({ min: 1, max: 300 }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    category: categoriesMock[categoryIndex],
    requests: [],
    bookings: [],
    priceType: ServicePriceType.FIXED,
  };
}

export const servicesMock: IServiceTemplate[] = Array.from(
  { length: 20 },
  (_, index) =>
    generateServiceMock(
      index + 1,
      faker.number.int({ min: 0, max: categoriesMock.length - 1 })
    )
);
