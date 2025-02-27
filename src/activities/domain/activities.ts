import { themes } from '../../themes/domain/themes';
import { ApiProperty } from '@nestjs/swagger';

export class activities {
  @ApiProperty({
    type: () => themes,
    nullable: false,
  })
  themeId: themes;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
