import { RECEIPT_ITEMS } from "../constants/modelConstants";
const Sequelize = require("sequelize");

const receiptItemsModel = (sequelize) => {
  return sequelize.define(
    RECEIPT_ITEMS,
    {
      id: {
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER(8),
        allowNull: true,
      },
      points: {
        type: Sequelize.INTEGER(8),
        allowNull: true,
      },
      sold_unit_price: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      total_price: {
        type: Sequelize.DOUBLE,
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

export default receiptItemsModel;
