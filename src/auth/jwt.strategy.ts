import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';


const cookieExtractor = req => {
    let jwt = null 
    try{
        if (req && req.cookies) {
            jwt = req.cookies['auth']['access_token']
        }
        return jwt
    }
    catch(e){
        throw new UnauthorizedException()
    }
    
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { username: payload.username };
  }
}