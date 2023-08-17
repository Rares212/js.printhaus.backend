import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { createMap, forMember, mapFrom, Mapper, MappingProfile } from "@automapper/core";
import { PrintMaterial } from "@src/app/printing/models/print-material";
import { FileInfo } from "@src/app/common/models/file-info";
import { FileInfoDto } from '@printnuts/common';
import { AwsS3Service } from "@src/app/common/services/aws-s3/aws-s3.service";

export class FileInfoProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper, private fileService: AwsS3Service) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        FileInfo,
        FileInfoDto,
        forMember(
          async (dest) => dest.file,
          mapFrom(async (src) => {
            const fileOutput = await this.fileService.getFile(
              src.s3Key,
              src.bucket,
            );
            if (fileOutput.Body instanceof Buffer) {
              return fileOutput.Body.toString('base64');
            }
            return ''; // or handle non-buffer cases as needed
          }),
        ),
      );
    }
  }
}