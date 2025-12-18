import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProfissionalsService } from './profissionals.service';
import { CreateProfessionalDto } from './dto/create-profissional.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Profissionals v1')
@Controller('v1/profissionals')
export class ProfissionalsController {
  constructor(private readonly profissionalsService: ProfissionalsService) {}

  @Post()
  create(@Body() CreateProfessionalDto: CreateProfessionalDto) {
    return this.profissionalsService.create(CreateProfessionalDto);
  }

  @Get()
  findAll() {
    return this.profissionalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profissionalsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profissionalsService.remove(+id);
  }
}
