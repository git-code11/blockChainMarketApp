const { DataTypes } = require('sequelize');
const {sequelize} = require('./index');

const User = sequelize.define('User', {
    userId:{
        type:DataTypes.STRING,
        allowNull:false,
        primaryKey:true
    },
    userName:DataTypes.STRING,
    token:DataTypes.TEXT
});

module.exports = User;

