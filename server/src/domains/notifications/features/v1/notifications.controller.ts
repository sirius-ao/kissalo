import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { currentUser } from '@core/http/decorators/currentUser.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsEmailVerifiedGuard } from '@core/http/guards/isEmailVerifiedGuard';

@ApiTags('Notification V1')
@UseGuards(IsEmailVerifiedGuard)
@Controller('v1/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all notification with paginations',
  })
  findAll(
    @currentUser() userId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.notificationsService.findAll(userId, page, limit);
  }

  @Patch(':to')
  @ApiOperation({
    summary: 'Reading all notification from x to y',
  })
  read(@currentUser() userId: number, @Param('to', ParseIntPipe) to: number) {
    return this.notificationsService.read(userId, to);
  }
}
