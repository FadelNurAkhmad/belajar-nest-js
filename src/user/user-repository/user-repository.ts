// import { Connection } from '../connection/connection';
import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {
    console.info('Create user repository');
  }

  async save(firstName: string, lastName?: string): Promise<User> {
    return this.prismaService.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    });
  }
}
// export class UserRepository {
//   connection: Connection;

//   save() {
//     console.info(`save user with connection ${this.connection.getName()}`);
//   }
// }

// export function createUserRepository(connection: Connection): UserRepository {
//   const userRepository = new UserRepository();
//   userRepository.connection = connection;
//   return userRepository;
// }
