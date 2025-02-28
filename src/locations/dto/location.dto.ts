import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LocationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
