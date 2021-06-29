const Sequelize = require("sequelize");
import { CREDENTIALS } from "../constants/modelConstants";

const credentialsModel = (sequelize) => {
  return sequelize.define(
    CREDENTIALS,
    {
      id: {
        type: Sequelize.INTEGER(50),
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      app_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      app_key: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      app_secret: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
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

export default credentialsModel;
