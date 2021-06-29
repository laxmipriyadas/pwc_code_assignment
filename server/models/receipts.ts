const Sequelize = require("sequelize");
import { RECEIPTS } from "../constants/modelConstants";

const receiptModel = (sequelize) => {
  return sequelize.define(
    RECEIPTS,
    {
      receipt_id: {
        type: Sequelize.INTEGER(20),
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      receipt_number: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      customer_external_id: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      total_bill_amount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      eligible_amount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      receipt_txn_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      points_awarded: {
        type: Sequelize.INTEGER(20),
        allowNull: true,
      },
      remarks: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      ocr_confident_level: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      is_flagged: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      is_flagged_open: {
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
      txn_ref_no: {
        type:  Sequelize.STRING(50),
        allowNull: true
      },
    },
    {
      indexes: [
        {
          fields: ["store_id", "status_id", "submitted_by", "template_id"],
        },
      ],
      freezeTableName: true,
      underscored: true,
    }
  );
};

export default receiptModel;
