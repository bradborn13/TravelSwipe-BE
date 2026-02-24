import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { OAuthUser } from './models/structure';
import { User } from 'src/infrastructure/user.schema';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO, RegisterDto } from './dto/input/Auth';
import * as bcrypt from 'bcrypt';
interface JWTToken {
  _id: string;
  email: string;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly authRepo: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async generateJWT(user: JWTToken) {
    const payload = {
      sub: user._id,
      email: user.email,
    };

    return {
      access_token: await this.jwtService.sign(payload),
    };
  }

  async login(user: LoginDTO) {
    const existingUser = await this.authRepo.getByEmail(user.email);
    if (!existingUser) throw new ConflictException('User not registered');
    const isMatch = await bcrypt.compare(
      user.password,
      existingUser.password ?? '',
    );

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials ');
    }
    return this.generateJWT({
      _id: existingUser?._id.toString(),
      email: existingUser.email,
    });
  }
  async register(dto: RegisterDto) {
    const existingUser = await this.authRepo.getByEmail(dto.email);
    if (existingUser) throw new ConflictException('Email already in use');

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const newUser = await this.authRepo.addUser({
      email: dto.email,
      fullname: dto.fullname,
      password: hashedPassword,
    });

    return this.generateJWT({
      _id: newUser._id.toString(),
      email: newUser.email,
    });
  }

  async validateOAuthUser(details: OAuthUser) {
    // 1. Try to find the user by email (The primary identifier)
    let user = await this.authRepo.getByEmail(details.email);

    if (user) {
      let updated = false;

      if (details.googleId && user.googleId !== details.googleId) {
        user.googleId = details.googleId;
        updated = true;
      }

      if (details.facebookId && user.facebookId !== details.facebookId) {
        user.facebookId = details.facebookId;
        updated = true;
      }

      if (updated) await user.save();
      return user;
    }

    const newUser: User = {
      email: details.email,
      googleId: details.googleId,
      facebookId: details.facebookId,
      fullname: `${details.firstName} ${details.lastName}`,
      provider: details.googleId ? 'google' : 'facebook',
    };
    const addedUser = await this.authRepo.addUser(newUser);
    return await this.generateJWT({
      _id: addedUser._id.toString(),
      email: addedUser.email,
    });
  }
}
