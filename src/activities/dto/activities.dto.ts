import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class activitiesDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
