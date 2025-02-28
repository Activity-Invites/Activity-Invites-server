import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum TicketSortField {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  STATUS = 'status',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class SortTicketDto {
  @ApiProperty({
    enum: TicketSortField,
    example: TicketSortField.CREATED_AT,
  })
  @IsNotEmpty()
  @IsEnum(TicketSortField)
  field: TicketSortField;

  @ApiProperty({
    enum: SortOrder,
    example: SortOrder.DESC,
  })
  @IsNotEmpty()
  @IsEnum(SortOrder)
  order: SortOrder;
}
