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
  Patch,
} from '@nestjs/common';
import { ProfissionalsService } from './profissionals.service';
import {
  CreateProfessionalDto,
  CreateProfissionalDocumentsDto,
  UpdateProfessionalDto,
  UpdateProfissionalDocumentsDto,
} from './dto/create-profissional.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { currentUser } from '@core/http/decorators/currentUser.decorator';
import { IsAdminGuard } from '@core/http/guards/isAdmin.guard';
import { IsProfissionalGuard } from '@core/http/guards/isProfissional.guard';

@ApiTags('Users v1')
@Controller('v1/users')
export class ProfissionalsController {
  constructor(private readonly profissionalsService: ProfissionalsService) {}

  @UseGuards(IsAdminGuard)
  @ApiOperation({
    summary: 'Profissionals list',
  })
  @Get()
  findAll() {
    return this.profissionalsService.findAll();
  }

  @ApiOperation({
    summary: 'Profissional account details',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(id);
    return this.profissionalsService.findOne(+id);
  }

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

  @UseGuards(IsProfissionalGuard)
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

  @UseGuards(IsProfissionalGuard)
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
  update(@Body() data: UpdateProfessionalDto, @currentUser() userId: number) {
    return this.profissionalsService.update(data, userId);
  }
}
