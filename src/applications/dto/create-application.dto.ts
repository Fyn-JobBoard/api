import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsString, MaxLength } from 'class-validator';
import { ApplicationStatus } from 'src/common/enums/applicationStatus';

export class CreateApplicationDto {
  @IsDefined()
  @IsString()
  @MaxLength(8192)
  @ApiProperty({
    description: 'The message of the application',
    maxLength: 8192,
    type: 'string',
    example:
      'I am very interested in this job and I believe I have the skills and experience to excel in this role.',
  })
  message: string;

  @IsEnum(ApplicationStatus)
  @IsDefined()
  @ApiProperty({
    description: 'The status of the application',
    enum: ApplicationStatus,
  })
  status: ApplicationStatus;
}
