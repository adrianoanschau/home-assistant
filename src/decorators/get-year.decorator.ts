import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getYear } from 'date-fns';
import { Request } from 'express';

export const CurrentYear = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    let year = `${getYear(new Date())}`;
    if (request.headers['year']) year = request.headers['year'] as string;
    if (request.query['year']) year = request.query['year'] as string;
    if (request.body['year']) year = request.body['year'];

    return parseInt(year, 10);
  },
);
