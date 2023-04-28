import { sequelize } from "../model";

export default async (req, res, next)=>{
    await sequelize.sync({force:false});
    return await next();
}