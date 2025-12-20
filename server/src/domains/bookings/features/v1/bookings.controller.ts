import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import {
  UpdateBookinSatatusProfisional,
  UpdateBookingDto,
} from './dto/update-booking.dto';
import { currentUser } from '@core/http/decorators/currentUser.decorator';
import { IsClientGuard } from '@core/http/guards/isClient.guard';
import { ApiOperation } from '@nestjs/swagger';
import { IsProfissionalGuard } from '@core/http/guards/isProfissional.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({
    summary: 'booking creation',
  })
  @UseGuards(IsClientGuard)
  create(@Body() data: CreateBookingDto, @currentUser() userId: number) {
    return this.bookingsService.create(data, userId);
  }

  @Put()
  @ApiOperation({
    summary: 'booking acept or reject',
  })
  @UseGuards(IsProfissionalGuard)
  toogle(
    @Body() data: UpdateBookinSatatusProfisional,
    @currentUser() userId: number,
  ) {
    return this.bookingsService.toogle(data, userId);
  }

  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(+id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(+id);
  }
}
