import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { IsEmailVerifiedGuard } from '@core/http/guards/isEmailVerifiedGuard';
import { currentUser } from '@core/http/decorators/currentUser.decorator';

@Controller('v1/clients')
@Controller('Clients v1')
// @UseGuards(IsEmailVerifiedGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  async create(@Body() createClientDto: CreateClientDto) {
    return await this.clientsService.create(createClientDto);
  }

  @Get()
  findAll(
    @currentUser() userId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.clientsService.get(page, limit, userId);
  }
}
