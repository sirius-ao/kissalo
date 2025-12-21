import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Query,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
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

@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('bookings')
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

  @Put()
  @UseGuards(IsProfissionalGuard)
  @ApiOperation({
    summary: 'Aceitar ou rejeitar um agendamento',
    description:
      'Permite que o profissional aceite ou rejeite um agendamento pendente',
  })
  @ApiBody({ type: UpdateBookinSatatusProfisional })
  @ApiResponse({ status: 200, description: 'Status do agendamento atualizado' })
  @ApiResponse({
    status: 403,
    description: 'Apenas o profissional pode executar esta ação',
  })
  toogle(
    @Body() data: UpdateBookinSatatusProfisional,
    @currentUser() userId: number,
  ) {
    return this.bookingsService.toogle(data, userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar agendamentos',
    description: 'Lista os agendamentos do utilizador autenticado',
  })
  @ApiQuery({ name: 'page', required: true, example: 1 })
  @ApiQuery({ name: 'limit', required: true, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Lista de agendamentos retornada com sucesso',
  })
  findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @currentUser() userId: number,
  ) {
    return this.bookingsService.findAll(page, limit, userId);
  }
  @Get(':id')
  @ApiOperation({
    summary: 'Buscar agendamento por ID',
    description: 'Retorna os detalhes completos de um agendamento',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Agendamento encontrado' })
  @ApiResponse({ status: 404, description: 'Agendamento não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Cancelar um agendamento',
    description:
      'Permite que o cliente, profissional ou administrador cancele um agendamento',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateBookinSatatusProfisional })
  @ApiResponse({
    status: 200,
    description: 'Agendamento cancelado com sucesso',
  })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para cancelar este agendamento',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @currentUser() userId: number,
    @Body() data: UpdateBookinSatatusProfisional,
  ) {
    return this.bookingsService.cancel(id, userId, data);
  }
}
