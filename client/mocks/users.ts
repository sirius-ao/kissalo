import { faker } from "@faker-js/faker";

export const mockUser = () => ({
  id: faker.number.int({ min: 1, max: 9999 }),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
});

export const mockProfessional = () => ({
  id: faker.number.int({ min: 1, max: 9999 }),
  user: mockUser(),
  rating: faker.number.float({ min: 3, max: 5 }),
});
