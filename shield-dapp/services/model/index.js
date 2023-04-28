import {Sequelize} from 'sequelize';

//console.log(process.env.DB_URI);


const sequelize = new Sequelize({
    dialect:'sqlite',
    storage:"./data.db",
    define:{
        freezeTableName:true
    },
    logging:false
});



const ping = async ()=>{
    try{
        await sequelize.authenticate();
        console.debug("Connection established");
    }catch(err){
        console.error("Connection Error", err);
    }
}

export {sequelize, ping};
