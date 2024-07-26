import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserSchemaName } from '../../schemas/user.schema';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectModel(UserSchemaName) private readonly userModel: Model<any>,
        configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: JwtPayload): Promise<any> {
        const { id } = payload;
        const user = await this.userModel.findById(id);

        if (!user)
            throw new UnauthorizedException('Token not valid');

        if (!user.isActive)
            throw new UnauthorizedException('User is inactive, talk with an admin');

        return user;
    }
}
