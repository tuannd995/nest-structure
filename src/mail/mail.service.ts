import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  //send mail with template to user with user object as parameter
  async sendMail(user: User) {
    const url = 'http://localhost:3000/login';
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to PmSystem!',
      template: './confirmMail',
      context: {
        username: user.username,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        url,
      },
    });
  }
}
