import createRouter from '../../middleware/createRouter';
import User from '../../model/User';
//--/info/:uid
const router = createRouter()
    .get(async (req, res)=>{
        const user = await User.findByPk(req.query.id);
        if(user){
            const {id:uid, name} = user;
            return res.json({uid, name});
        }
        return res.json({});
    });

export default router;