export enum UserRole {
  CUSTOMER = "CUSTOMER",
  PROFESSIONAL = "PROFESSIONAL",
  ADMIN = "ADMIN",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}

export enum ProfessionalType {
  ENTERPRISE = "ENTERPRISE",
  INDIVIDUAL = "INDIVIDUAL",
}

export enum ServicePriceType {
  FIXED = "FIXED",
  HOURLY = "HOURLY",
}

export enum ServiceLocation {
  CLIENT_HOME = "CLIENT_HOME",
  PROFESSIONAL_HOME = "PROFESSIONAL_HOME",
  PROFESSIONAL_SPACE = "PROFESSIONAL_SPACE",
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  STARTED = "STARTED",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  REFUNDED = "REFUNDED",
}

export enum NotificationType {
  BOOKING = "BOOKING",
  REVIEW = "REVIEW",
  SYSTEM = "SYSTEM",
  ALERT = "ALERT",
  PAYMENT = "PAYMENT",
  AUTH = "AUTH",
}

export enum NotificationChannel {
  EMAIL = "EMAIL",
  PUSH = "PUSH",
  SMS = "SMS",
}

export enum BookingPriority {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export enum VerificationType {
  ACCOUNT_VERIFICATION = "ACCOUNT_VERIFICATION",
  PASSWORD_RESET = "PASSWORD_RESET",
  PROFESSIONAL_DOCUMENTS = "PROFESSIONAL_DOCUMENTS",
}

export enum ApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}
