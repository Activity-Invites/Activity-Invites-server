import { Module } from '@nestjs/common';

import { FilesService } from './files.service';
import fileConfig from './config/file.config';
import { FileConfig, FileDriver } from './config/file-config.type';
import { FilesLocalModule } from './infrastructure/uploader/local/files.module';
import { FilesS3Module } from './infrastructure/uploader/s3/files.module';
import { FilesS3PresignedModule } from './infrastructure/uploader/s3-presigned/files.module';
import { PrismaModule } from '../prisma/prisma.module';
import { FileRepository } from './repositories/file.repository';

const infrastructureUploaderModule =
  (fileConfig() as FileConfig).driver === FileDriver.LOCAL
    ? FilesLocalModule
    : (fileConfig() as FileConfig).driver === FileDriver.S3
      ? FilesS3Module
      : FilesS3PresignedModule;

@Module({
  imports: [PrismaModule, infrastructureUploaderModule],
  providers: [FilesService, FileRepository],
  exports: [FilesService, FileRepository],
})
export class FilesModule {}
