import createRouter from '../../middleware/createRouter';
import auth from '../../middleware/auth';

const router = createRouter()
    .use(auth)
    .post(async (req, res)=>{
        const _user = req.user;
        const {name} = req.body;
        await _user.update({name});
        {
        const {id:uid, name} = _user;
        return res.json({uid, name});
        }
    });

export default router;