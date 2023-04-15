const {Router} = require("express");
const {authenticate} = require('../controller');
const User = require('../model/User');
const router = Router();

router.get('/info/:uid', async (req, res)=>{
    const user = await User.findByPk(req.params.uid);
    if(user){
        const {userId:uid, userName} = user;
        return res.json({info:{uid, userName}});
    }
    return res.json({});
});

router.post('/update', authenticate(), async (req, res)=>{
    const _user = req.user;
    const {userName} = req.body;
    await _user.update({userName});
    {
    const {userId:uid, userName} = _user;
    return res.json({info:{uid, userName}});
    }
});

module.exports = router;