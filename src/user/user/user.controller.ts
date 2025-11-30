import { MailService, mailService } from './../mail/mail.service';
import {
  Controller,
  Get,
  Header,
  HttpCode,
  Inject,
  Post,
  Query,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import type { HttpRedirectResponse } from '@nestjs/common';
import type { Request, Response } from 'express';
import { UserService } from './user.service';
import { Connection } from '../connection/connection';
import { UserRepository } from '../user-repository/user-repository';

@Controller('/api/users')
export class UserController {
  constructor(
    private service: UserService,
    private connection: Connection,
    private mailService: MailService,
    @Inject('EmailService') private emailService: MailService,
    private userRepository: UserRepository,
  ) {}

  @Get('/connection')
  async getConnection(): Promise<string> {
    this.userRepository.save();
    this.mailService.send();
    this.emailService.send();

    return this.connection.getName();
  }

  @Get('/hello')
  // @UseFilters(ValidationFilter)
  async sayHello(@Query('name') name: string): Promise<string> {
    return this.service.sayHello(name);
  }
  @Get('/view/hello')
  viewHello(@Query('name') name: string, @Res() response: Response) {
    response.render('index.html', {
      title: 'Template Engine',
      name: name,
    });
  }

  @Get('/set-cookie')
  setCookie(@Query('name') name: string, @Res() response: Response) {
    response.cookie('name', name);
    response.status(200).send('Success Set Cookie');
  }

  @Get('/get-cookie')
  getCookie(@Req() requet: Request): string {
    return requet.cookies['name'];
  }

  // ---------- Route: GET /api/users/sample-response ----------
  @Get('/sample-response')
  @Header('Content-Type', 'application/json')
  @HttpCode(200)
  sampleResponse(): Record<string, string> {
    // return type: objek dengan key string dan value string
    // Nest otomatis serializes return value menjadi JSON (karena default JSON serializer)
    return {
      data: 'Hello JSON',
    };
  }

  @Get('/redirect')
  @Redirect() // memberi tahu Nest bahwa ini route redirect
  redirect(): HttpRedirectResponse {
    // tipe yang lebih eksplisit (lihat catatan import type)
    // Mengembalikan objek yang berisi url dan statusCode.
    // Nest akan menggunakan nilai ini untuk membentuk redirect response:
    // - meng-set status code (mis. 301)
    // - men-set Location header menjadi url yang diberikan
    return {
      url: '/api/users/sample-response',
      statusCode: 301,
    };
  }

  //   @Get('sample-response')
  //   sampleResponseDua(@Res() response: Response) {
  //     response.status(200).send('Sample Response');
  //   }

  // @Get('/hello')
  // async sayHello(
  //   @Query('first_name') firstName: string,
  //   @Query('last_name') lastName: string,
  // ): Promise<string> {
  //   return `Hello ${firstName} ${lastName}`;
  // }

  // async = Mengubah fungsi agar selalu mengembalikan Promise & bisa memakai await
  // Promise<string> = Janji/objek asynchronous yang akan berisi string ketika selesai

  @Get('/:id')
  getById(@Req() request: Request): string {
    return `GET ${request.params.id}`;
  }
  @Post()
  post(): string {
    return 'POST';
  }

  @Get('/sample')
  get(): string {
    return 'Hello NestJS';
  }
}
