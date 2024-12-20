import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  readonly username: string;
  @ApiProperty()
  readonly password: string;
}

export class LoginResponseDto {
  @ApiProperty()
  readonly accessToken: string;
}
