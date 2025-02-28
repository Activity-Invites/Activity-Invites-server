import { Module } from '@nestjs/common';
import { LocationRepository } from '../location.repository';
import { LocationRelationalRepository } from './repositories/location.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationEntity } from './entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LocationEntity])],
  providers: [
    {
      provide: LocationRepository,
      useClass: LocationRelationalRepository,
    },
  ],
  exports: [LocationRepository],
})
export class RelationalLocationPersistenceModule {}
