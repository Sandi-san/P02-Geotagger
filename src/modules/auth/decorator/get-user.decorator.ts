import { createParamDecorator, ExecutionContext } from '@nestjs/common';
//namesto uporabe @Req Request v user.controller, vrni User objekt
export const GetLoggedUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    //get content of HTTP request
    const request: Express.Request = ctx.switchToHttp().getRequest();
    //if "data" variable exists, return only that property
    if (data) return request.user[data];
    //otherwise return full request.user object
    return request.user;
  },
);