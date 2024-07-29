import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';

import { User, UserSchemaName } from '../schemas/user.schema';
// import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(UserSchemaName) private readonly userModel: Model<any>,
    private readonly jwtService: JwtService,
    private mailService: MailService
  ) { }

  async create(createUserDto: any) {
    try {
      const { password, ...userData } = createUserDto;
      const hashedPassword = bcrypt.hashSync(password, 10);
      const newUser = new this.userModel({ ...userData, password: hashedPassword });
      const user = await newUser.save();
      const { password: _, ...result } = user.toObject(); // Exclude password from the result

      return {
        ...result,
        token: this.getJwtToken({ id: user.id })
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: any) {
    const { email, password } = loginUserDto;
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedException('Credentials are not valid (email)');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Credentials are not valid (password)');
    }
    const { password: _, ...result } = user.toObject(); // Exclude password from the result
    return {
      ...result,
      token: this.getJwtToken({ id: user.id })
    };
  }

  async checkAuthStatus(user: any) {
    return {
      ...user.toObject(),
      token: this.getJwtToken({ id: user.id })
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }


  // AuthService

  async sendPasswordResetCode(email: string, method: 'sms' | 'email') {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const expiry = new Date(new Date().getTime() + 15 * 60000); // 15 minutes from now

    // Store code and expiry in the user document
    user.passwordResetCode = resetCode;
    user.passwordResetExpiry = expiry;
    await user.save();

    // Send code via SMS or email
    if (method === 'sms') {
      // Use an SMS service to send the code
    } else if (method === "email") {
      await this.mailService.sendMail(
        email,
        'Destap! Código de verificación',
        'Código de verificación',
        `<h1>Coloque esto en Destap! para poder resetear su contraseña.</h1>
        <p>Tu código es: ${resetCode}</p>`
      );

      return {
        message: "Email enviado correctamente."
      }
    }
  }

  async verifyPasswordResetCode(email: string, code: string) {
    const user = await this.userModel.findOne({ email }).select('+passwordResetCode +passwordResetExpiry');

    if (!user || user.passwordResetCode !== code || new Date() > user.passwordResetExpiry) {
      console.log("verifyPasswordResetCode", code)
      throw new BadRequestException('Invalid or expired reset code');
    }

    const tempToken = this.jwtService.sign({ id: user.id }, { expiresIn: '15m' });
    return { tempToken };
  }

  async resetPassword(tempToken: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(tempToken);
      const user = await this.userModel.findById(payload.id).select('+passwordResetCode +passwordResetExpiry');
      if (!user) {
        throw new NotFoundException('User not found');
      }

      user.password = bcrypt.hashSync(newPassword, 10); // Hash the new password
      await user.save();

      return {
        message: "Contraseña reseteada correctamente."
      }

      // Optionally invalidate the temp token or any existing session
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async findById(id: string) {
    return this.userModel.findById(id);
  }

  private handleDBErrors(error: any): never {
    if (error.code === 11000) { // MongoDB duplicate key error
      throw new BadRequestException('User already exists');
    }
    console.error(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
