const Sequelize = require("sequelize");
import { USER_TOKEN } from "../constants/modelConstants";

const userTokenModel = (sequelize) => {
  return sequelize.define(
    USER_TOKEN,
    {
      id: {
        type: Sequelize.INTEGER(20),
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      admin_id: {
        type: Sequelize.BIGINT(20),
        allowNull: true,
      },
      app_id: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      jwt_token: {
        type: Sequelize.STRING(1024),
        allowNull: true,
      },
      expires_on: {
        type: Sequelize.DATE(),
        allowNull: true,
      },
    },
    {
      indexes: [
        {
          fields: ["id"],
        },
      ],
      freezeTableName: true,
      underscored: true,
    }
  );
};

export default userTokenModel;
