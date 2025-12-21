import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  Put,
  UseGuards,
<<<<<<< HEAD
  Patch,
=======
>>>>>>> 8969769 (feat : Slug Service)
} from '@nestjs/common';
import { ProfissionalsService } from './profissionals.service';
import {
  CreateProfessionalDto,
  CreateProfissionalDocumentsDto,
  UpdateProfissionalDocumentsDto,
} from './dto/create-profissional.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { currentUser } from '@core/http/decorators/currentUser.decorator';
import { IsAdminGuard } from '@core/http/guards/isAdmin.guard';

@ApiTags('Profissionals v1')
@Controller('v1/profissionals')
export class ProfissionalsController {
  constructor(private readonly profissionalsService: ProfissionalsService) {}

  @UseGuards(IsAdminGuard)
  @Patch('/toogle')
  @ApiOperation({
    summary: 'Profissional account toogle status , only for admin',
  })
  remove(@Body() data: UpdateProfissionalDocumentsDto) {
    return this.profissionalsService.tooleStatus(data);
  }

  @Post()
  @ApiOperation({
    summary: 'Profissional account create',
  })
  create(@Body() data: CreateProfessionalDto) {
    return this.profissionalsService.create(data);
  }

  @Post('/docs')
  @ApiOperation({
    summary: 'Profissional documents create',
  })
  createDocument(
    @Body() data: CreateProfissionalDocumentsDto,
    @currentUser() userId: number,
  ) {
    return this.profissionalsService.createDocument(userId, data);
  }

  @Post('/request/verification')
  @ApiOperation({
    summary: 'Profissional account request verification',
  })
  requestVerification(
    @Body() data: CreateProfissionalDocumentsDto,
    @currentUser() userId: number,
  ) {
    return this.profissionalsService.requestVerification(data, userId);
  }
  @ApiOperation({
    summary: 'Profissional account update',
  })
  @Put()
  update(@Body() data: CreateProfessionalDto, @currentUser() userId: number) {
    return this.profissionalsService.update(data, userId);
  }
  @ApiOperation({
    summary: 'Profissionals list',
  })
  @Get()
  findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('isVerified') isVerified: boolean | undefined,
  ) {
    return this.profissionalsService.findAll(page, limit, isVerified);
  }
  @ApiOperation({
    summary: 'Profissional account details',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profissionalsService.findOne(+id);
  }
<<<<<<< HEAD
=======

  @UseGuards(IsAdminGuard)
  @ApiOperation({
    summary: 'Profissional account toogle status , only for admin',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profissionalsService.tooleStatus(+id);
  }
>>>>>>> 8969769 (feat : Slug Service)
}
