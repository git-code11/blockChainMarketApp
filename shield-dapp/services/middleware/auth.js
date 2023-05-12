import createRouter from './createRouter';
import { getToken } from 'next-auth/jwt';
import User from '../model/User';

const handler = createRouter().use(
    async (req, res, next)=>{
        const token = await getToken({ req });
        if(token){
            const user = await User.findByPk(token.sub.uid);
            req.user = user;
            return await next();
        }else{
            return res.status(401).json({success:false, message:"UnAuthenticated"});
        }
    }
);
          
export default handler;