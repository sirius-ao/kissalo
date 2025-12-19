import { PartialType } from '@nestjs/swagger';
import { CreateServiceDto } from '../dto/create-service.dto';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
