import nextConnect from 'next-connect';
import auth from '../../middleware/auth';
import dbConnect from '../../middleware/dbConnect';

const router = nextConnect()
    .use(auth)
    .use(dbConnect)
    .post(async (req, res)=>{
        const _user = req.user;
        const {userName} = req.body;
        await _user.update({userName});
        {
        const {id:uid, userName} = _user;
        return res.json({uid, userName});
        }
    });

export default router;