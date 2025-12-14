import { PartialType } from '@nestjs/swagger';
import { CreateConciliationDto } from './create-conciliation.dto';

export class UpdateConciliationDto extends PartialType(CreateConciliationDto) {}
