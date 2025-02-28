import { ThemesDto } from '../../themes/dto/themes.dto';

import {
  // decorators here
  Type,
} from 'class-transformer';

import {
  // decorators here

  ValidateNested,
  IsNotEmptyObject,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateActivitiesDto {
  @ApiProperty({
    required: true,
    type: () => ThemesDto,
  })
  @ValidateNested()
  @Type(() => ThemesDto)
  @IsNotEmptyObject()
  themeId: ThemesDto;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
