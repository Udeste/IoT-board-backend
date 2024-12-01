import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto, LoginResponseDto } from './auth.dto';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthService {

  private readonly users = [{
    id: 0,
    username: this.configService.get<string>('IOTBRD_ADMIN_API_ADMIN_USER'),
    password: this.configService.get<string>('IOTBRD_ADMIN_API_ADMIN_PASSWORD'),
    name: 'admin',
    email: 'admin@localhost',
    role: 'admin',
    invalidatedAccessTookens: [],
    invalidatedRefreshTookens: [],
  }];
  private readonly issuer: string = this.configService.get<string>('IOTBRD_ADMIN_API_TOKEN_ISSUER');
  private readonly refreshSecret: string = this.configService.get<string>('IOTBRD_ADMIN_API_REFRESH_SECRET');
  private readonly authSecret: string = this.configService.get<string>('IOTBRD_ADMIN_API_AUTH_SECRET');

  constructor(private configService: ConfigService) { }

  login(credentials: LoginDto): { accessToken: string, refreshToken: string } {
    const user = this.users.find(u => u.username === credentials.username);
    if (user && (user.password === credentials.password)) {
      return this.generateTokens(user)
    }
    throw new UnauthorizedException();
  }

  logout(): boolean {
    return true;
  }

  refreshToken(refreshToken: string) {
    try {
      if (!refreshToken) {
        throw new UnauthorizedException()

      }
      const { id, iss, role } = jwt.verify(refreshToken, this.refreshSecret) as jwt.JwtPayload

      if (iss !== this.issuer) {
        throw new UnauthorizedException()
      }

      return this.generateTokens({ id, role })
    } catch {
      throw new UnauthorizedException()
    }
  }

  private generateTokens(user): { accessToken: string, refreshToken: string } {
    return {
      accessToken: jwt.sign(
        { id: user.id, role: user.role },
        this.authSecret,
        { expiresIn: this.configService.get<string>('IOTBRD_ADMIN_API_ACCESS_TOKEN_EXP', '60s'), issuer: this.issuer  }
      ),
      refreshToken: jwt.sign(
        { id: user.id, role: user.role },
        this.refreshSecret,
        { expiresIn: this.configService.get<string>('IOTBRD_ADMIN_API_REFRESH_TOKEN_EXP', '7d'), issuer: this.issuer }
      )
    }
  }
}
