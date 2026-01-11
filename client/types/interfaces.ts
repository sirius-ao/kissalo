import { ReactNode } from "react";
import {
  ApprovalStatus,
  BookingPriority,
  BookingStatus,
  NotificationType,
  NotificationChannel,
  PaymentStatus,
  ServiceLocation,
  ServicePriceType,
  UserRole,
  UserStatus,
  VerificationType,
  ProfessionalType,
} from "./enum";

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  stats?: any;
  amountAvaliable: number;
  createdAt: Date;
  updatedAt: Date;

  professional?: IProfessional;
  notifications: INotification[];
  bookings: IBooking[];
  reviews: IReview[];
  payments: IPayment[];
  verifications: any;
  bookingsteps: IBookingSteps[];
  conclidation: IConcliationPayment[];
}

export interface IProfessional {
  id: number;
  userId: number;
  type: ProfessionalType;
  autoSelect: boolean;
  title?: string;
  description?: string;
  documentNumber: string;
  yearsExperience: number;
  isVerified: boolean;
  verificationStatus: ApprovalStatus;
  averageRating: number;
  specialties: string[];
  certifications: string[];
  portfolioUrl?: string;
  coverUrl?: string;
  cvUrl?: string;
  contacts: string[];
  socialMedia?: any;
  stats?: any;
  createdAt: Date;
  updatedAt: Date;

  user: IUser;
  serviceRequests: IProfessionalServiceRequest[];
  bookings: IBooking[];
  wallets: IWallet[];
  reviews: IReview[];
  payments: IPayment[];
  docs: any[];
}

export interface ICategory {
  id: number;
  title: string;
  slug: string;
  description?: string;
  color?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  services: IServiceTemplate[];
}

export interface IServiceTemplate {
  id: number;
  categoryId: number;
  title: string;
  shortDescription?: string;
  description: string;
  deliverables: any;
  slug: string;
  keywords: string[];
  requirements: string[];
  gallery: string[];
  videoUrl?: string;
  bannerUrl?: string;
  isNegotiable: boolean;
  requiresApproval: boolean;
  price: number;
  priceType: ServicePriceType;
  currency: string;
  duration: number;
  isActive: boolean;
  isFeatured: boolean;
  maxRequestsPerDay?: number;
  maxBookings?: number;
  viewsCount: number;
  bookingsCount: number;
  ratingAverage: number;
  ratingCount: number;
  createdAt: Date;
  updatedAt: Date;

  category: ICategory;
  requests: IProfessionalServiceRequest[];
  bookings: IBooking[];
}

export interface IProfessionalServiceRequest {
  id: number;
  professionalId: number;
  serviceId: number;
  status: ApprovalStatus;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;

  professional: IProfessional;
  service: IServiceTemplate;
}

export interface IBooking {
  id: number;
  clientId: number;
  professionalId?: number;
  serviceId: number;
  canEnd: boolean;
  scheduleDate: Date;
  startTime: Date;
  endTime: Date;
  location: ServiceLocation;
  address: any;
  priority: BookingPriority;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  canceledAt?: Date;
  cancelReason?: Date;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  client: IUser;
  professional?: IProfessional;
  service: IServiceTemplate;
  payment?: IPayment;
  review?: IReview;
  steps: IBookingSteps[];
}

export interface IBookingSteps {
  id: number;
  bookingId: number;
  senderId: number;
  notes: string;
  files: string[];
  createdAt: Date;

  booking: IBooking;
  user: IUser;
}

export interface IPayment {
  id: number;
  bookingId: number;
  clientId: number;
  professionalId?: number;
  fileUrl?: string;
  amount: number;
  currency: string;
  method: string;
  status: PaymentStatus;
  paidAt?: Date;
  refundedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  booking: IBooking;
  client: IUser;
  professional?: IProfessional;
  conclidation?: IConcliationPayment;
}

export interface IWallet {
  id: number;
  professionalId: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  professional: IProfessional;
  conclidation: IConcliationPayment[];
}

export interface IConcliationPayment {
  id: number;
  paymentId: number;
  userId: number;
  waaletId: number;
  fileUrl?: string;

  payment: IPayment;
  profissional: IUser;
  wallet: IWallet;
}

export interface IReview {
  id: number;
  bookingId: number;
  clientId: number;
  professionalId: number;
  rating: number;
  comment?: string;
  professionalReply?: string;
  repliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  booking: IBooking;
  client: IUser;
  professional: IProfessional;
}

export interface INotification {
  id: number;
  userId: number;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  message: string;
  deepLink?: string;
  isRead: boolean;
  createdAt: Date;

  user: IUser;
}

export interface IPaymentMethod {
  title: string;
  icon: string;
}


export interface IImage {
  id: number;
  imageHeight: number;
  imageWidth: number;
  imageSize: number;
  largeImageURL: string;
  previewURL: string;
  webformatURL: string;
  tags: string[];
  type: string;
}


export interface IServiceCreate {
  categoryId: number;                 // ID da categoria
  title: string;                      // Título do serviço
  shortDescription: string;           // Subtítulo ou descrição curta
  description: string;                // Descrição detalhada
  deliverables: string;               // Entregáveis do serviço
  slug: string;                       // Slug para URL
  keywords: string[];                 // Palavras-chave para busca
  requirements: string[];             // Requisitos necessários
  gallery: string[];                  // Imagens da galeria
  bannerUrl: string;                  // URL do banner principal
  price: number;                      // Preço do serviço
  duration: number;                   // Duração em dias ou horas
}
