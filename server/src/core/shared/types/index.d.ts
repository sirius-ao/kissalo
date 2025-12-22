import { User, UserRole } from '@prisma/client';

export interface ILoginUseCase {
  unique: string;
  password: string;
}
export interface ILoginUseCaseReturnType {
  user: Omit<User, 'password'>;
  acessToken: string;
}

export interface IAcessToken {
  sub: number;
}
export interface IRefreshToken {
  sub: number;
  role: UserRole;
}

export interface ISocialMedia {
  title: string;
  icon: string;
  link: string;
}
export interface IAddress {
  province: string;
  city: string;
  district: string;
  street: string;
  reference?: string;
  latitude?: number;
  longitude?: number;
}

import { Prisma } from '@prisma/client';

export type BookingWithRelations = Prisma.BookingGetPayload<{
  include: {
    client: true;
    professional: {
      include: {
        user: {
          omit: {
            password: true;
          };
        };
      };
    };
    service: {
      include: {
        category: true;
      };
    };
    steps: true;
    review: true;
    payment: true;
  };
}>;

export interface Image {
  id: number;
  type: string;
  tags: string;
  webformatURL: string;
  largeImageURL: string;
  previewURL: string;
  imageWidth: number;
  imageHeight: number;
  imageSize: number;
}
