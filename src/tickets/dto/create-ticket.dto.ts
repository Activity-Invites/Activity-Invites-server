import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({
    description: '活动ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  activityId: string;

  // This will be set by the controller
  userId?: string;
}
