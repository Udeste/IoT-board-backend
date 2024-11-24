import { Body, Controller, Get, Post, UseGuards, Request, Res } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { LoginDto, LoginResponseDto } from './auth.dto';
import { AuthService } from './auth.service';
import { Public } from './auth.guard';
import { Response } from 'express'

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('login')
  @ApiResponse({ description: 'The access token', type: LoginResponseDto })
  async login(@Body() credentials: LoginDto, @Res({ passthrough: true }) res: Response): Promise<LoginResponseDto | false> {
    const { accessToken, refreshToken } = this.authService.login(credentials);

    return this.setAndReturnTokens(res, { accessToken, refreshToken })
  }

  @Get('logout')
  @ApiResponse({ description: 'Logout success or failure', type: Boolean })
  async logout(@Res({ passthrough: true }) res: Response): Promise<boolean> {
    res.clearCookie('refresh_token', { httpOnly: true });
    return this.authService.logout();
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Get('refresh')
  @ApiResponse({ description: 'The access token', type: LoginResponseDto })
  refreshToken(@Request() req, @Res({ passthrough: true }) res: Response): LoginResponseDto {
    const { accessToken, refreshToken } = this.authService.refreshToken(req.cookies.refresh_token);

    return this.setAndReturnTokens(res, { accessToken, refreshToken })
  }

  private setAndReturnTokens(res: Response, { accessToken, refreshToken }: { accessToken: string, refreshToken: string }): LoginResponseDto {
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })

    return { accessToken }
  }
}
