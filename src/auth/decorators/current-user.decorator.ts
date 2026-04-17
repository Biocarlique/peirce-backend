import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    (data: string | undefined, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // If a specific property is requested (e.g., @CurrentUser('sub')), return it.
        // Otherwise, return the whole user object.
        return data ? user?.[data] : user;
    },
);
