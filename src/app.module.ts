import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from './accounts/accounts.module';
import { AppController } from './app.controller';
import appDatasource from './app.datasource';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(appDatasource.options),
    AccountsModule,
    StudentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
