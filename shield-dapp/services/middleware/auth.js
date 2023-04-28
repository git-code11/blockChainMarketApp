import nextConnect from 'next-connect'
import passport from 'passport'
import { authenticate } from '../lib/passport';

const handler = nextConnect()
          .use(passport.initialize())
          //.use(passport.session())
          .use(authenticate());

export default handler;