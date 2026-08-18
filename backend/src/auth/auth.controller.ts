import { Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('guest')
  guest() {
    return {
      user: { id: 'guest', name: 'Dexter', email: 'dexter@gmail.com', role: 'guest' },
      session: 'guest'
    };
  }
}
