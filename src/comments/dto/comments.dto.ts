import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class commentsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
