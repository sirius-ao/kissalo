import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsClientGuard } from '@core/http/guards/isClient.guard';
import { currentUser } from '@core/http/decorators/currentUser.decorator';

@ApiTags('Review v1')
@Controller('v1/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({
    summary: 'Review create only for cliente',
  })
  @UseGuards(IsClientGuard)
  create(
    @Body() createReviewDto: CreateReviewDto,
    @currentUser() userid: number,
  ) {
    return this.reviewsService.create(createReviewDto, userid);
  }
  
  @Patch()
  @ApiOperation({
    summary: 'Review replay',
  })
  update(
    @Body() updateReviewDto: UpdateReviewDto,
    @currentUser() userid: number,
  ) {
    return this.reviewsService.replay(userid, updateReviewDto);
  }
}
