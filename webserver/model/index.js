const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(process.env.DB_URI,{
    define:{
        freezeTableName:true
    }
});


const ping = async ()=>{
    try{
        await sequelize.authenticate();
        console.debug("Connection established");
    }catch(err){
        console.error("Connection Error", err);
    }
}

module.exports = {sequelize, ping};
