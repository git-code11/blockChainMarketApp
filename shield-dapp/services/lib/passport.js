import passport from 'passport';
import {Strategy as StrategyJwt, ExtractJwt} from 'passport-jwt';
import User from '../model/User';

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET_KEY;

const strategy = new StrategyJwt(opts, async function(jwt_payload, done){
    const {me} = jwt_payload;
    try{
        const [_user] = await User.findOrCreate({where:{id:me}});
        done(null, _user);
    }catch(err){
        done(err, false);
    }
});

const useStrategy = ()=>passport.use(strategy);

const useSerial = ()=>{
    passport.serializeUser(function (user, done) {
    // serialize the username into session
    done(null, user.username)
  });
  
  passport.deserializeUser(function (id, done) {
        // deserialize the username back into user object
        const user = User.findByPk(id)
        done(null, user)
    });
}

const authenticate = ()=>passport.authenticate('jwt',{session:false});
useStrategy();

export {authenticate};


