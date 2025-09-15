import { Controller, Req, Post, UseGuards, Get,SetMetadata, Body, Res } from '@nestjs/common';
import { Request, Response } from 'express'; 
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { Public } from './isPublic';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}



  
  @Public()
  @UseGuards(LocalAuthGuard) // ✅ Usa Local para autenticar con usuario/contraseña
  @Post('login')
  async login(@Req() req, @Body() dto: LoginDto,@Res({ passthrough: true }) res: Response) {
    // req.user ya incluye { id, usuario, nombre, email, roles }
    const { access_token, user } = await this.authService.login(req.user);

    // 1) Poner cookie 'jwt', HttpOnly y segura
    // res.cookie('jwt', access_token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production', // sólo HTTPS en prod
    //   sameSite: 'lax',
    //   maxAge: 12 * 60 * 60 * 1000,  // 12 horas
    // });

    
    return { access_token,user };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req) {
    
    return req.user;
  }

  
}