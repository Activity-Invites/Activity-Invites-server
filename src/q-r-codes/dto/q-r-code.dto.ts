import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class QRCodeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
