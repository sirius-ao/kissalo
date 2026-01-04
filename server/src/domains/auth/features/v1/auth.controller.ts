import { Controller, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateAuthDto,
  ResetPasswordDto,
  UpateCredentials,
  UpdateProfileDto,
} from './dto/create-auth.dto';
import { currentUser } from '@core/http/decorators/currentUser.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth V1')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/me')
  @ApiOperation({
    summary: 'Ge me',
  })
  me(@currentUser() userId: number) {
    return this.authService.me(userId);
  }

  @Post('/login')
  @ApiOperation({
    summary: 'Login',
  })
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @Put(':token/verify')
  @ApiOperation({
    summary: 'Verify account',
  })
  verify(@Param('token') token: string) {
    return this.authService.verify(token);
  }

  @Put('/credentials')
  @ApiOperation({
    summary: 'Credentials update',
  })
  credentials(@currentUser() userId: number, @Body() data: UpateCredentials) {
    return this.authService.updateCredentials(data, userId);
  }

  @Put('/profile')
  @ApiOperation({
    summary: 'profile update',
  })
  profile(@currentUser() userId: number, @Body() data: UpdateProfileDto) {
    console.log(userId);
    return this.authService.update(data, userId);
  }

  @Put(':token/refresh')
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

  @Put(':unique/recovery')
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
