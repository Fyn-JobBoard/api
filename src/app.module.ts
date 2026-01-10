import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from './accounts/accounts.module';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [AccountsModule, StudentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
