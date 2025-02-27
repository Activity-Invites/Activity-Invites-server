import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class themesDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
