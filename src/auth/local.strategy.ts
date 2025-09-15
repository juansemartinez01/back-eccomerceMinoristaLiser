// src/auth/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // le decimos que el campo “username” en la petición se llama “usuario”
    super({ usernameField: 'usuario', passwordField: 'password' });
  }

  async validate(usuario: string, password: string) {
    const user = await this.authService.validateUser(usuario, password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return user;  // irá en req.user
  }
}


