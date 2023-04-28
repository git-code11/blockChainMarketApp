import nextConnect from 'next-connect';
import dbConnect from '../../middleware/dbConnect';
import User from '../../model/User';
//--/info/:uid
const router = nextConnect()
    .use(dbConnect)
    .get(async (req, res)=>{
        const user = await User.findByPk(req.query.id);
        if(user){
            const {id:uid, userName} = user;
            return res.json({uid, userName});
        }
        return res.json({});
    });

export default router;