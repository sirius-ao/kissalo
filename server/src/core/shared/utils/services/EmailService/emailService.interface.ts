export interface EmailServiceInterface {
  send(data: EmailParams): Promise<void>;
  validate(): Promise<boolean>;
}

export type EmailParams = {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
  metadata?: Record<string, any>;
};

export type EmailResult = {
  success: boolean;
  messageId?: string;
  provider?: string;
  error?: Error;
};

// src/shared/infrastructure/email/config/nodemailer.config.ts
export interface NodemailerConfig {
  // Configurações básicas
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };

  // Configurações avançadas
  pool?: boolean;
  maxConnections?: number;
  maxMessages?: number;
  rateDelta?: number;
  rateLimit?: number;

  // Configurações de conexão
  connectionTimeout?: number;
  greetingTimeout?: number;
  socketTimeout?: number;
  dnsTimeout?: number;

  // Configurações de TLS
  tls?: {
    rejectUnauthorized?: boolean;
    minVersion?: string;
    ciphers?: string;
  };

  // Configurações de debug
  debug?: boolean;
  logger?: boolean;

  // Configurações específicas
  from: string;
  name?: string;
  replyTo?: string;

  // Configurações de retry
  retryAttempts?: number;
  retryDelay?: number;
}

