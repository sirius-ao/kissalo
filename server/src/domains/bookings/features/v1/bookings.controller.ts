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
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookinSatatusProfisional } from './dto/update-booking.dto';
import { currentUser } from '@core/http/decorators/currentUser.decorator';
import { IsClientGuard } from '@core/http/guards/isClient.guard';
import { IsProfissionalGuard } from '@core/http/guards/isProfissional.guard';
import { IsEmailVerifiedGuard } from '@core/http/guards/isEmailVerifiedGuard';

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
  @ApiResponse({ status: 201, description: 'Agendamento criado com sucesso' })
  @ApiResponse({
    status: 403,
    description: 'Apenas clientes podem criar agendamentos',
  })
  create(@Body() data: CreateBookingDto, @currentUser() userId: number) {
    return this.bookingsService.create(data, userId);
  }

  @Post(':id/steps')
  @ApiOperation({
    summary: 'Criar etapa do agendamento',
    description:
      'Permite que o cliente ou o profissional adicionem uma etapa ao agendamento',
  })
  @ApiResponse({ status: 201, description: 'Etapa criada com sucesso' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  createSteps(
    @Body() data: UpdateBookinSatatusProfisional,
    @currentUser() userId: number,
    @Param('id', ParseIntPipe) bookingId: number,
  ) {
    data.bookingId = bookingId;
    return this.bookingsService.createSteps(data, userId);
  }

  @Patch(':id/start')
  @UseGuards(IsProfissionalGuard)
  @ApiOperation({
    summary: 'Iniciar execução do agendamento',
    description:
      'Permite que o profissional inicie a execução do serviço agendado',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Agendamento iniciado com sucesso',
  })
  start(
    @Param('id', ParseIntPipe) bookingId: number,
    @currentUser() userId: number,
  ) {
    return this.bookingsService.start(bookingId, userId);
  }

  @Patch(':id/end')
  @UseGuards(IsProfissionalGuard)
  @ApiOperation({
    summary: 'Terminar execução do agendamento',
    description:
      'Permite que o profissional termine a execução do serviço agendado',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Agendamento terminado com sucesso',
  })
  end(
    @Param('id', ParseIntPipe) bookingId: number,
    @currentUser() userId: number,
  ) {
    return this.bookingsService.end(bookingId, userId);
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

  @Patch(':id/status')
  @UseGuards(IsProfissionalGuard)
  @ApiOperation({
    summary: 'Aceitar ou rejeitar um agendamento',
    description:
      'Permite que o profissional aceite ou rejeite um agendamento pendente',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateBookinSatatusProfisional })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso' })
  updateStatus(
    @Param('id', ParseIntPipe) bookingId: number,
    @Body() data: UpdateBookinSatatusProfisional,
    @currentUser() userId: number,
  ) {
    data.bookingId = bookingId;
    return this.bookingsService.toogle(data, userId);
  }

  // ============================
  // LIST BOOKINGS
  // ============================
  @Get()
  @ApiOperation({
    summary: 'Listar agendamentos',
    description: 'Lista os agendamentos do utilizador autenticado',
  })
  @ApiQuery({ name: 'page', example: 1 })
  @ApiQuery({ name: 'limit', example: 10 })
  findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @currentUser() userId: number,
  ) {
    return this.bookingsService.findAll(page, limit, userId);
  }

  // ============================
  // GET BOOKING BY ID
  // ============================
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar agendamento por ID',
    description: 'Retorna os detalhes completos de um agendamento',
  })
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.findOne(id);
  }

  // ============================
  // CANCEL BOOKING
  // ============================
  @Delete(':id')
  @ApiOperation({
    summary: 'Cancelar um agendamento',
    description:
      'Permite que o cliente, profissional ou administrador cancele um agendamento',
  })
  @ApiParam({ name: 'id', example: 1 })
  cancel(
    @Param('id', ParseIntPipe) bookingId: number,
    @currentUser() userId: number,
    @Body() data: UpdateBookinSatatusProfisional,
  ) {
    data.bookingId = bookingId;
    return this.bookingsService.cancel(userId, data);
  }
}
