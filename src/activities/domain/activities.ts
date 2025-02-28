import { Themes } from '../../themes/domain/themes';
import { ApiProperty } from '@nestjs/swagger';

export class Activities {
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
