// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreatethemesDto } from './create-themes.dto';

export class UpdatethemesDto extends PartialType(CreatethemesDto) {}
