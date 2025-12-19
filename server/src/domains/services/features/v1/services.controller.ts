import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServicesService } from './services.service';
import { UpdateServiceDto } from '../../dto/update-service.dto';

@Controller({
  path: 'services',
  version: '1',
})
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  async create(@Body() createServiceDto: UpdateServiceDto) {
    return await this.servicesService.create(createServiceDto);
  }

  @Get()
  async findAll() {
    return await this.servicesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.servicesService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return await this.servicesService.update(+id, updateServiceDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.servicesService.remove(+id);
  }

  @Get('category/:categoryId')
  async findByCategory(@Param('categoryId') categoryId: string) {
    return await this.servicesService.findByCategory(+categoryId);
  }
}
