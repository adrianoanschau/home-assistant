import { Module } from '@nestjs/common';
import { AdminModule as NestAdminModule } from '@adminjs/nestjs';
import * as AdminJSTypeORM from '@adminjs/typeorm';
import AdminJS from 'adminjs';
import {
  EntryEntity,
  EstimatedEntryEntity,
  UserEntity,
} from '../database/entities';

AdminJS.registerAdapter({
  Resource: AdminJSTypeORM.Resource,
  Database: AdminJSTypeORM.Database,
});

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
};

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

@Module({
  imports: [
    NestAdminModule.createAdminAsync({
      useFactory: () => ({
        adminJsOptions: {
          rootPath: '/admin',
          resources: [EntryEntity, EstimatedEntryEntity, UserEntity],
        },
        auth: {
          authenticate,
          cookieName: 'adminjs',
          cookiePassword: 'secret',
        },
        sessionOptions: {
          resave: true,
          saveUninitialized: true,
          secret: 'secret',
        },
      }),
    }),
  ],
})
export class AdminJsModule {}
