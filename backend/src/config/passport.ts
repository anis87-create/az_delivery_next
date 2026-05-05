import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { PassportStatic } from 'passport';
import User from '../models/User';

export default (passport: PassportStatic) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is missing");
  }

  const clientID = process.env.GOOGLE_CLIENT_ID;

  if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_SECRET is missing");
  }

  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  passport.use(
    new GoogleStrategy({
      clientID,
      clientSecret,
      callbackURL: '/api/auth/google/callback'
    }, async (accessToken, refreshToke, profile, done) => {
      let existingUser = await User.findOne({ googleId: profile.id });
      const photoUrl = profile.photos?.[0]?.value;
      if (!existingUser) {
        try {
          existingUser = await new User({
            googleId: profile.id,
            email: profile.emails?.[0]?.value,
            fullName: profile.displayName,
            password: 'GOOGLE_OAUTH',
            role: 'customer',
            avatar: photoUrl,
          }).save();
        } catch (error) {
          return done(error as Error);
        }
      } else if (photoUrl && !existingUser.avatar) {
        existingUser = await User.findByIdAndUpdate(
          existingUser._id,
          { avatar: photoUrl },
          { new: true }
        );
      }
      if (existingUser) {
        return done(null, { _id: existingUser._id.toString(), role: existingUser.role });
      }
    })
  );

  if (!process.env.FACEBOOK_APP_ID) {
    throw new Error("FACEBOOK_APP_ID is missing");
  }

  if (!process.env.FACEBOOK_APP_SECRET) {
    throw new Error("FACEBOOK_APP_SECRET is missing");
  }

  passport.use(
    new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: 'http://localhost:5000/api/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'emails', 'photos']
    }, async (accessToken, refreshToken, profile, done) => {
      let existingUser = await User.findOne({ facebookId: profile.id });
      const photoUrl = profile.photos?.[0]?.value;
      if (!existingUser) {
        try {
          existingUser = await new User({
            facebookId: profile.id,
            email: profile.emails?.[0]?.value ?? `facebook_${profile.id}@noemail.local`,
            fullName: profile.displayName,
            password: 'FACEBOOK_OAUTH',
            role: 'customer',
            avatar: photoUrl,
          }).save();
        } catch (error) {
          return done(error as Error);
        }
      } else if (photoUrl && !existingUser.avatar) {
        existingUser = await User.findByIdAndUpdate(
          existingUser._id,
          { avatar: photoUrl },
          { new: true }
        );
      }
      if (existingUser) {
        return done(null, { _id: existingUser._id.toString(), role: existingUser.role });
      }
    })
  );

  passport.serializeUser((user: Express.User, done: (err: any, id?: unknown) => void) => {
    done(null, (user as any)._id);
  });

  passport.deserializeUser(async (id: string, done: (err: any, user?: Express.User | false | null) => void) => {
    try {
      const user = await User.findById(id);

      if (!user) {
        return done(null, false);
      }

      done(null, { _id: user._id.toString(), role: user.role });
    } catch (err) {
      done(err);
    }
  });
}
