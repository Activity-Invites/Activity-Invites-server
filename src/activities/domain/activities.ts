



import { Themes } from '../../themes/domain/themes';
import { ApiProperty } from '@nestjs/swagger';

export class Activities {
  @ApiProperty({
    type: () =>
      Date,
    nullable: false,
  })

  endTime: Date;

  @ApiProperty({
    type: () =>
      Date,
    nullable: false,
  })

  startTime: Date;

  @ApiProperty({
    type: () =>
      String,
    nullable: false,
  })

  mainImage?: string;

  @ApiProperty({
    type: () =>
      String,
    nullable: false,
  })

  name?: string;

  @ApiProperty({
    type: () => Themes,
    nullable: false,
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
