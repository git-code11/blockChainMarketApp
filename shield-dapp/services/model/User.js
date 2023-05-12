import { DataTypes } from 'sequelize';
import {sequelize} from '.';
//import { models } from "@next-auth/sequelize-adapter";

const User = sequelize.define("user", {
   // ...models.User,
    id: {
        type: DataTypes.STRING,
        primaryKey:true,
        //unique: true,
    },
    name:{
        type: DataTypes.STRING,
        defaultValue:"Anonymous"
    }
});

export const findOrCreate = async (id)=>{
    await sequelize.sync({force:false});
    
    const [user] = await User.findOrCreate({
        where:{
            id
        }
    });
    return user
};


export default User;

