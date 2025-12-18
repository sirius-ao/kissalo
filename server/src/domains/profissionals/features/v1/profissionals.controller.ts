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
import { CreateProfissionalDto } from '../../dto/create-profissional.dto';
import { UpdateProfissionalDto } from '../../dto/update-profissional.dto';

@Controller('profissionals')
export class ProfissionalsController {
  constructor(private readonly profissionalsService: ProfissionalsService) {}

  @Post()
  create(@Body() createProfissionalDto: CreateProfissionalDto) {
    return this.profissionalsService.create(createProfissionalDto);
  }

  @Get()
  findAll() {
    return this.profissionalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profissionalsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProfissionalDto: UpdateProfissionalDto,
  ) {
    return this.profissionalsService.update(+id, updateProfissionalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profissionalsService.remove(+id);
  }
}
