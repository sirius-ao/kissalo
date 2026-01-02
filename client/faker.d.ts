declare module "@faker-js/faker" {
  export * from "@faker-js/faker/dist/types";
  const faker: import("@faker-js/faker/dist/types").Faker;
  export { faker };
}
