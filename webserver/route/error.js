
function errHandler(err, req, res, next) {
    res.status(err.status || 500);
    return res.json({error:true, msg:err.message});
};

module.exports = errHandler;
  