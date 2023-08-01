import {PrintSettingsDto, SupportedFileTypes } from "@printnuts/common";
import {
  IsDefined, IsEnum,
  IsMongoId,
  IsNotEmpty,
  ValidateNested
} from "class-validator";
import { Transform, Type } from "class-transformer";

export class PrintModelDetailsReqDto {

  @IsDefined()
  @IsEnum(SupportedFileTypes)
  fileType: SupportedFileTypes;

  @IsNotEmpty()
  @IsMongoId()
  materialId: string;

  @Transform(({ value }) => JSON.parse(value))
  @Type(() => PrintSettingsDto)
  @IsDefined()
  @ValidateNested()
  printSettings: PrintSettingsDto;
}
