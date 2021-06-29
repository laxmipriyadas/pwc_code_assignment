import { STORE_ALIAS } from "../constants/modelConstants";
const Sequelize = require("sequelize");

const storealiasModel = (sequelize) => {
  return sequelize.define(
    STORE_ALIAS,
    {
      id: {
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      alias_name: {
        type: Sequelize.STRING(500),
        allowNull: false,
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

export default storealiasModel;
