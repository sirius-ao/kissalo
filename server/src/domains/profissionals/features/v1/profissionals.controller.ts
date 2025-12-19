import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { ProfissionalsService } from './profissionals.service';
import {
  CreateProfessionalDto,
  CreateProfissionalDocumentsDto,
} from './dto/create-profissional.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { currentUser } from '@core/http/decorators/currentUser.decorator';

@ApiTags('Profissionals v1')
@Controller('v1/profissionals')
export class ProfissionalsController {
  constructor(private readonly profissionalsService: ProfissionalsService) {}

  @Post()
  @ApiOperation({
    summary: 'Profissional account create',
  })
  create(@Body() data: CreateProfessionalDto) {
    return this.profissionalsService.create(data);
  }
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

  @ApiOperation({
    summary: 'Profissional account toogle status , only for admin',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profissionalsService.tooleStatus(+id);
  }
}
