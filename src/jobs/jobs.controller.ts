import { Controller } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobsService } from './jobs.service';

@Controller()
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  create(createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  findAll() {
    return this.jobsService.findAll();
  }

  findOne(id: number) {
    return this.jobsService.findOne(id);
  }

  update(updateJobDto: UpdateJobDto) {
    return this.jobsService.update(updateJobDto.id, updateJobDto);
  }

  remove(id: number) {
    return this.jobsService.remove(id);
  }
}
