import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { EnvVars } from "src/common/constants/env-vars.contant";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        configService: ConfigService
    ) {
        super({
            clientID: configService.get(EnvVars.GOOGLE_CLIENT_ID),
            clientSecret: configService.get(EnvVars.GOOGLE_CLIENT_SECRET),
            /*
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            */
            callbackURL: `${process.env.EXPRESS_APP}/auth/google/redirect`,
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { name, emails, photos } = profile;
        //console.log("OAuth data: ",profile)
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            image: photos[0].value,
        };
        done(null, user);
    }
}