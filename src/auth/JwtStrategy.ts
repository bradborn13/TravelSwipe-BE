import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || '', // Must match what you used in JwtModule
    });
  }

  // After the token is verified, this runs.
  // Whatever you return here is injected into @Req() req.user
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
