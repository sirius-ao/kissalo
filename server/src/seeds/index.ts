import { BcryptService } from '../core/shared/utils/services/CryptoService/crypto.service';
import { PrismaPg } from '@prisma/adapter-pg';
import { loadEnvFile } from 'process';
loadEnvFile();
import {
  PrismaClient,
  UserRole,
  UserStatus,
  ProfessionalType,
  ServicePriceType,
} from '@prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({
  connectionString,
});
const prisma = new PrismaClient({
  adapter,
});
export async function runSeeds() {
  const bcript = new BcryptService();
  console.log('🌱 Iniciando seeds...');
  const password = await bcript.encript(process.env.ADMIN_PASS);

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'System',
      email: process.env.ADMIN_EMAIL,
      phone: '900000001',
      password,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      isEmailVerified: true,
    },
  });

  const client = await prisma.user.upsert({
    where: { email: 'client@test.com' },
    update: {},
    create: {
      firstName: 'Cliente',
      lastName: 'Teste',
      email: 'client@test.com',
      phone: '900000002',
      password,
      role: UserRole.CUSTOMER,
      isEmailVerified: true,
    },
  });

  const professionalUser = await prisma.user.upsert({
    where: { email: 'pro@test.com' },
    update: {},
    create: {
      firstName: 'Profissional',
      lastName: 'Teste',
      email: 'pro@test.com',
      phone: '900000003',
      password,
      role: UserRole.PROFESSIONAL,
      isEmailVerified: true,
    },
  });

  const professional = await prisma.professional.upsert({
    where: { userId: professionalUser.id },
    update: {},
    create: {
      userId: professionalUser.id,
      type: ProfessionalType.INDIVIDUAL,
      documentNumber: 'DOC-123456',
      yearsExperience: 5,
      specialties: ['Canalização', 'Eletricidade'],
      certifications: ['Certificado Técnico'],
      contacts: ['900000003'],
      title: 'Técnico Multisserviços',
      description: 'Profissional experiente em serviços domésticos',
      isVerified: true,
    },
  });

  const category = await prisma.category.upsert({
    where: { slug: 'servicos-domesticos' },
    update: {},
    create: {
      title: 'Serviços Domésticos',
      slug: 'servicos-domesticos',
      description: 'Serviços para casa',
      color: '#FF9900',
    },
  });

  const service = await prisma.serviceTemplate.upsert({
    where: { slug: 'reparo-eletrico' },
    update: {},
    create: {
      categoryId: category.id,
      title: 'Reparo Elétrico',
      slug: 'reparo-eletrico',
      description: 'Manutenção e reparos elétricos residenciais',
      shortDescription: 'Eletricista profissional',
      keywords: ['eletricidade', 'reparo', 'casa'],
      requirements: ['Energia desligada'],
      priceType: ServicePriceType.FIXED,
      duration: 60,
      currency: 'AOA',
      isActive: true,
      price: 1000,
      gallery: [],
      
    },
  });

  await prisma.professionalServiceRequest.upsert({
    where: {
      professionalId_serviceId: {
        professionalId: professional.id,
        serviceId: service.id,
      },
    },
    update: {},
    create: {
      professionalId: professional.id,
      serviceId: service.id,
      status: 'APPROVED',
    },
  });

  console.log('✅ Seeds executadas com sucesso!');
}

runSeeds()
  .catch((e) => {
    console.error('❌ Erro ao rodar seeds', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
