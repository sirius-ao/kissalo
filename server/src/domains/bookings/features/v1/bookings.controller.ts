import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

import { BookingsService } from './bookings.service';
import { CreateBookingDto, CreateStepsDto } from './dto/create-booking.dto';
import { UpdateBookinStatus } from './dto/update-booking.dto';
import { currentUser } from '@core/http/decorators/currentUser.decorator';
import { IsClientGuard } from '@core/http/guards/isClient.guard';
import { IsEmailVerifiedGuard } from '@core/http/guards/isEmailVerifiedGuard';
import { IsAdminGuard } from '@core/http/guards/isAdmin.guard';

@ApiTags('Bookings V1')
@ApiBearerAuth()
@Controller('v1/bookings')
@UseGuards(IsEmailVerifiedGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}
  @Post()
  @UseGuards(IsClientGuard)
  @ApiOperation({
    summary: 'Criar um agendamento',
    description: 'Permite que um cliente crie um novo agendamento de serviço',
  })
  @ApiBody({ type: CreateBookingDto })
  create(@Body() data: CreateBookingDto, @currentUser() userId: number) {
    return this.bookingsService.create(data, userId);
  }

  @Post(':id/:userid/anex')
  @UseGuards(IsAdminGuard)
  @ApiOperation({
    summary: 'Anexar profissional ao serviço',
  })
  anex(
    @currentUser() userId: number,
    @Param('id', ParseIntPipe) bookingId: number,
    @Param('userid', ParseIntPipe) userid: number,
  ) {
    return this.bookingsService.anex(userid, bookingId);
  }

  @Post(':id/steps')
  @ApiOperation({
    summary: 'Criar etapa do agendamento',
    description:
      'Permite que o cliente ou o profissional adicionem uma etapa ao agendamento',
  })
  createSteps(
    @Body() data: CreateStepsDto,
    @currentUser() userId: number,
    @Param('id', ParseIntPipe) bookingId: number,
  ) {
    return this.bookingsService.createSteps(data, userId, bookingId);
  }

  @Patch(':id/toogle')
  @ApiOperation({
    summary: 'Aceitar ou rejeitar , etc um agendamento',
    description:
      'Permite que o profissional aceite ou rejeite um agendamento pendente',
  })
  toogle(
    @Param('id', ParseIntPipe) bookingId: number,
    @currentUser() userId: number,
    @Body() data: UpdateBookinStatus,
  ) {
    return this.bookingsService.toogle(data, userId, bookingId);
  }

  @Patch(':id/liberate')
  @UseGuards(IsClientGuard)
  @ApiOperation({
    summary:
      'Permitir que o profissional possa terminar execução do agendamento',
    description:
      'Permite que o profissional termine a execução do serviço agendado',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Agendamento terminado com sucesso',
  })
  liberate(
    @Param('id', ParseIntPipe) bookingId: number,
    @currentUser() userId: number,
  ) {
    return this.bookingsService.liberate(bookingId, userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar agendamentos',
    description: 'Lista os agendamentos do utilizador autenticado',
  })
  findAll(@currentUser() userId: number) {
    return this.bookingsService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar agendamento por ID',
    description: 'Retorna os detalhes completos de um agendamento',
  })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.findOne(id);
  }
}
