import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { LlmsService } from './llms.service';
import { IsAdminGuard } from '@core/http/guards/isAdmin.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@UseGuards(IsAdminGuard)
@ApiTags('Llms v1 ')
@Controller('v1/llms')
export class LlmsController {
  constructor(private readonly llmsService: LlmsService) {}

  @Get(':title/images')
  @ApiOperation({
    summary: 'Images generation based in title only for admin',
  })
  images(@Param('title') title: string) {
    return this.llmsService.genImages(title);
  }

  @Get(':prompt/prompt')
  @ApiOperation({
    summary: 'Ia generation only for admin',
  })
  prompt(@Param('prompt') prompt: string) {
    return this.llmsService.replayPrompt(prompt);
  }
}
