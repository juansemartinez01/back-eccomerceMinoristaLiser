import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }

  /** Valida usuario+contraseña y adjunta roles */
  async validateUser(usuario: string, pass: string): Promise<any> {
    const user = await this.usuarioService.findByUsername(usuario);
    if (!user) return null;

    const valid = await bcrypt.compare(pass, user.clave_hash);
    if (!valid) return null;

    // Mapear desde user.roles
    const roles = user.roles.map(ur => ur.rol.nombre);

    // Quitar el hash y la relación interna
    const { clave_hash, roles: _, ...rest } = user;

    await this.usuarioService.update(user.id, {
      ultimoLogin: new Date()
    });

    return {
      ...rest,
      roles,              // ej: ['Admin','Vendedor']
    };

  }

  /** Genera y devuelve el JWT */
  async login(user: any) {
    const payload = { sub: user.id, usuario: user.usuario, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
      user,               // devolvemos el objeto con id, usuario, nombre, email y roles
    };
  }
}
