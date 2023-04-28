import { DataTypes } from 'sequelize';
import {sequelize} from '.';

const User = sequelize.define('User', {
    id:{
        type:DataTypes.STRING,
        allowNull:false,
        primaryKey:true
    },
    userName:DataTypes.STRING,
    token:DataTypes.TEXT
});

export default User;

