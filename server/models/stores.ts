const Sequelize = require("sequelize");
import { STORES } from "../constants/modelConstants";

const storesModel = (sequelize) => {
  return sequelize.define(
    STORES,
    {
      store_id: {
        type: Sequelize.INTEGER(20),
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      store_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      address_line1: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      address_line2: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      pincode: {
        type: Sequelize.STRING(6),
        allowNull: false,
      },
      external_id: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      tillid: {
        type: Sequelize.STRING(645),
        allowNull: false,
      },
      till_password: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(20),
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
          fields: ["store_id"],
        },
      ],
      freezeTableName: true,
      underscored: true,
    }
  );
};

export default storesModel;
