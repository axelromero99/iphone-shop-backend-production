import { Controller, Get, Post, Body, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IncomingHttpHeaders } from 'http';

import { AuthService } from './auth.service';
import { RawHeaders, GetUser, Auth } from './decorators';
import { RoleProtected } from './decorators/role-protected.decorator';

import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';
import { AuditLog } from 'src/audit/audit-log.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @AuditLog()
  @Post('register')
  createUser(@Body() createUserDto: any) {

    return this.authService.create(createUserDto);
  }

  @AuditLog()
  @Post('login')
  loginUser(@Body() loginUserDto: any) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: any
  ) {
    return this.authService.checkAuthStatus(user);
  }

  // Password reset endpoints
  @AuditLog()
  @Post('password-reset')
  requestPasswordReset(@Body('email') email: string) {
    return this.authService.sendPasswordResetCode(email, 'email');
  }

  @AuditLog()
  @Post('password-reset/verify')
  verifyResetCode(@Body('email') email: string, @Body('code') code: string) {
    return this.authService.verifyPasswordResetCode(email, code);
  }

  @AuditLog()
  @Post('password-reset/confirm')
  resetPassword(@Body('token') token: string, @Body('newPassword') newPassword: string) {
    return this.authService.resetPassword(token, newPassword);
  }


  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: any,
    @GetUser('email') userEmail: string,

    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {


    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
      userEmail,
      rawHeaders,
      headers
    }
  }


  // @SetMetadata('roles', ['admin','super-user'])

  @Get('private2')
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user: any
  ) {

    return {
      ok: true,
      user
    }
  }

  @Get('private3')
  @Auth(ValidRoles.admin)
  privateRoute3(
    @GetUser() user: any
  ) {

    return {
      ok: true,
      user
    }
  }



}
