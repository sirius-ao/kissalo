import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceTemplateDto } from '@domains/services/dto/create-service.dto';
import { IsAdminGuard } from '@core/http/guards/isAdmin.guard';
import { UpdateServiceTemplateDto } from '@domains/services/dto/update-service.dto';
import { IsEmailVerifiedGuard } from '@core/http/guards/isEmailVerifiedGuard';
import { ApiTags } from '@nestjs/swagger';
import { currentUser } from '@core/http/decorators/currentUser.decorator';
import { ProfessionalServiceRequestDto } from '@domains/services/dto/professional-service-request.dto';


@Controller('v1/services')
@ApiTags('Services V1') 
@UseGuards(IsEmailVerifiedGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @UseGuards(IsAdminGuard)
  @Post()
  async create(@Body() data: CreateServiceTemplateDto) {
    return await this.servicesService.create(data);
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
  @UseGuards(IsAdminGuard)
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceTemplateDto,
  ) {
    return await this.servicesService.update(+id, updateServiceDto);
  }

  @Delete(':id')
  @UseGuards(IsAdminGuard)
  async remove(@Param('id') id: string) {
    return await this.servicesService.remove(+id);
  }

  @Get('category/:categoryId')
  async findByCategory(@Param('categoryId') categoryId: string) {
    return await this.servicesService.findByCategory(+categoryId);
  }

  @Post('professional/:serviceId')
  async professionalServicesRequest(
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @currentUser() userId: number,
    @Body() professionalServiceRequestDto: ProfessionalServiceRequestDto
  ) {
    return await this.servicesService.professionalServicesRequest(+serviceId, +userId, professionalServiceRequestDto);
  }

}
