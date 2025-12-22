import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { currentUser } from '@core/http/decorators/currentUser.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsAdminGuard } from '@core/http/guards/isAdmin.guard';
import { IsProfissionalGuard } from '@core/http/guards/isProfissional.guard';

@ApiTags('Wallets v1')
@Controller('v1/wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @UseGuards(IsProfissionalGuard)
  @ApiOperation({
    summary: 'Criação de carteiras para consolidação de pagamentos',
  })
  @Post()
  create(
    @Body() createWalletDto: CreateWalletDto,
    @currentUser() userId: number,
  ) {
    return this.walletsService.create(createWalletDto, userId);
  }

  @ApiOperation({
    summary: 'listagem de carteiras para consolidação de pagamentos',
  })
  @Get()
  findAll(
    @currentUser() userId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.walletsService.findAll(page, limit, userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'detalhes de carteiras para consolidação de pagamentos',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @currentUser() userId: number,
  ) {
    return this.walletsService.findOne(+id, userId);
  }

  @UseGuards(IsProfissionalGuard)
  @ApiOperation({
    summary:
      'actualização de dados de carteiras para consolidação de pagamentos',
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateWalletDto,
    @currentUser() userId: number,
  ) {
    return this.walletsService.update(+id, data, userId);
  }

  @ApiOperation({
    summary:
      'toogle status de carteiras para consolidação de pagamentos apenas para ADMIN',
  })
  @UseGuards(IsAdminGuard)
  @Put(':id')
  toogle(@Param('id', ParseIntPipe) id: number) {
    return this.walletsService.toggle(+id);
  }
}
