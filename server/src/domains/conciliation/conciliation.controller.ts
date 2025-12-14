import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConciliationService } from './conciliation.service';
import { CreateConciliationDto } from './dto/create-conciliation.dto';
import { UpdateConciliationDto } from './dto/update-conciliation.dto';

@Controller('conciliation')
export class ConciliationController {
  constructor(private readonly conciliationService: ConciliationService) {}

  @Post()
  create(@Body() createConciliationDto: CreateConciliationDto) {
    return this.conciliationService.create(createConciliationDto);
  }

  @Get()
  findAll() {
    return this.conciliationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conciliationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConciliationDto: UpdateConciliationDto) {
    return this.conciliationService.update(+id, updateConciliationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conciliationService.remove(+id);
  }
}
