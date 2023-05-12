import SequelizeAdapter from "@next-auth/sequelize-adapter";
import {sequelize} from '../../model';
import User from '../../model/User';

export default SequelizeAdapter(sequelize, {
    models: {
      User
    },
});