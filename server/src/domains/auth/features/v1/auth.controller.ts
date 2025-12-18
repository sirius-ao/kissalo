import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, ResetPasswordDto } from './dto/create-auth.dto';
import { currentUser } from '@core/http/decorators/currentUser.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth V1')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({
    summary: 'Login',
  })
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @Put('/verify/:token')
  @ApiOperation({
    summary: 'Verify account',
  })
  verify(@Param('token') token: string) {
    return this.authService.verify(token);
  }

  @Put('/refresh/:token')
  @ApiOperation({
    summary: 'refresh account',
  })
  refresh(@Param('token') token: string) {
    return this.authService.refresh(token);
  }

  @Delete('/logout')
  @ApiOperation({
    summary: 'Logout',
  })
  remove(@currentUser() userId: number) {
    return this.authService.logout(userId);
  }

  @Patch('/recovery/:unique')
  @ApiOperation({
    summary: 'request recovery account',
  })
  recovery(@Param('unique') unique: string) {
    return this.authService.recoveryRequest(unique);
  }

  @Post('/reset')
  @ApiOperation({
    summary: 'reset account password',
  })
  reset(@Body() data: ResetPasswordDto) {
    return this.authService.resetPassword(data);
  }
}
