import { PRODUCT_ALIAS } from "../constants/modelConstants";
const Sequelize = require("sequelize");

const productaliasModel = (sequelize) => {
  return sequelize.define(
    PRODUCT_ALIAS,
    {
      id: {
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      alias_name: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
    },
    {
      indexes: [
        {
          fields: ["product_id"],
        },
      ],
      freezeTableName: true,
      underscored: true,
    }
  );
};

export default productaliasModel;
