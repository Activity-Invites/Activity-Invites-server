// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateactivitiesDto } from './create-activities.dto';

export class UpdateactivitiesDto extends PartialType(CreateactivitiesDto) {}
