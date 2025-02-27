import { themesDto } from '../../themes/dto/themes.dto';

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

export class CreateactivitiesDto {
  @ApiProperty({
    required: true,
    type: () => themesDto,
  })
  @ValidateNested()
  @Type(() => themesDto)
  @IsNotEmptyObject()
  themeId: themesDto;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
