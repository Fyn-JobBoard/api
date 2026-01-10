import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/accounts/accounts.module';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

@Module({
  imports: [AccountsModule],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
