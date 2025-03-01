import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SocialCardDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
