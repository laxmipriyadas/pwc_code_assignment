const Sequelize = require("sequelize");
import { RECEIPT_LOG } from "../constants/modelConstants";

const receiptLogModel = (sequelize) => {
  return sequelize.define(
    RECEIPT_LOG,
    {
      id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      prev_status: {
        type: Sequelize.INTEGER(20),
        allowNull: true,
      },
      new_status: {
        type: Sequelize.INTEGER(20),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      notes: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },
      cap_request_id: {
        type: Sequelize.STRING(45),
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
export default receiptLogModel;
