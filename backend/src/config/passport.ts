import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
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
         if (!existingUser) {
            try {
               existingUser = await new User({
                 googleId: profile.id,
                 email: profile.emails?.[0]?.value,
                 fullName: profile.displayName,
                 password: 'GOOGLE_OAUTH',
                 phoneNumber: '',
                 role: 'customer',
               }).save();
            } catch (error) {
                return done(error as Error);
            }
          
           }
         if (existingUser) {
             return done(null, { _id: existingUser._id.toString(), role: existingUser.role });
        }
     })
     
   );

   passport.serializeUser((user: Express.User, done: (err: any, id?: unknown) => void) => {
    done(null, (user as any).id);
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
