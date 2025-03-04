import { Themes } from '../../themes/domain/themes';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../utils/repository/entity-metadata';

export class Activities extends BaseEntity {
  @ApiProperty({
    type: () => Date,
    nullable: true,
  })
  endTime: Date;

  @ApiProperty({
    type: () => Date,
    nullable: true,
  })
  startTime: Date;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  mainImage?: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    type: () => Themes,
    nullable: true,
  })
  themeId: Themes;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
