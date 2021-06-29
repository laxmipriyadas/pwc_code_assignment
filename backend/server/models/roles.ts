import { ROLES } from "../constants/modelConstants";
const Sequelize = require("sequelize");

const rolesModel = (sequelize) => {
  return sequelize.define(
    ROLES,
    {
      roll_id: {
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      roll_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      indexes: [
        {
          fields: ["roll_id"],
        },
      ],
      freezeTableName: true,
      underscored: true,
    }
  );
};

export default rolesModel;
