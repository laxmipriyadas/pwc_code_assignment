import { PRODUCTS } from "../constants/modelConstants";
const Sequelize = require("sequelize");

const productsModel = (sequelize) => {
  return sequelize.define(
    PRODUCTS,
    {
      product_id: {
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },

      product_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      unit_price: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      product_image: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      is_listing: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
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
          fields: ["product_id"],
        },
      ],
      freezeTableName: true,
      underscored: true,
    }
  );
};

export default productsModel;
