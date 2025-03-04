



import { ThemesDto } from '../../themes/dto/themes.dto';

import {
  // decorators here
  Type,


  Transform,

} from 'class-transformer';

import {
  // decorators here

  ValidateNested,
  IsNotEmptyObject,


  IsString,


  IsOptional,









  IsDate,




} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateActivitiesDto {
  @ApiProperty({
    required: true,
    type: () =>
      Date,
  })

  @Transform(({ value }) => new Date(value))
  @IsDate()

  endTime: Date;

  @ApiProperty({
    required: true,
    type: () =>
      Date,
  })

  @Transform(({ value }) => new Date(value))
  @IsDate()

  startTime: Date;

  @ApiProperty({
    required: false,
    type: () =>
      String,
  })

  @IsOptional()
  @IsString()

  mainImage?: string;

  @ApiProperty({
    required: false,
    type: () =>
      String,
  })

  @IsOptional()
  @IsString()

  name: string;

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
