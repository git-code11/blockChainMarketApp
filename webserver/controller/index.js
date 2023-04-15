const passport = require('passport');
const {Strategy:StrategyJwt, ExtractJwt} = require('passport-jwt');
const User = require('../model/User');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

const strategy = new StrategyJwt(opts, async function(jwt_payload, done){
    const {me} = jwt_payload;
    try{
        // let _user = await User.findByPk(me);
        // if(!_user){
        //     _user = await User.create({userId:me});
        // }
        const [_user] = await User.findOrCreate({where:{userId:me}});
        done(null, _user);
    }catch(err){
        done(err, false);
    }
});

const useStrategy = ()=>passport.use(strategy);

const authenticate = ()=>passport.authenticate('jwt',{session:false});

module.exports = {authenticate, useStrategy}

