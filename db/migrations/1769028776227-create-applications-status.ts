import { ApplicationStatus } from 'src/common/enums/applicationStatus';
import { PGEnumToType } from './utils/enumTypeGen';

export class CreateApplicationsStatus1769028776227 extends PGEnumToType {
  constructor() {
    super({
      application_status: ApplicationStatus,
    });
  }
}
