const Sequelize = require("sequelize");
import { ADMIN_USERS } from "../constants/modelConstants";

const adminUsersModel = (sequelize) => {
  return sequelize.define(
    ADMIN_USERS,
    {
      admin_id: {
        type: Sequelize.INTEGER(20),
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      user_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      first_name: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      last_name: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      roll_id: {
        type: Sequelize.BIGINT(20),
        allowNull: false,
      },
      is_super_admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      last_login: {
        type: Sequelize.STRING(45),
        allowNull: true,
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
      is_deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }
    },
    {
      indexes: [
        {
          fields: ["admin_id", "roll_id"],
        },
      ],
      freezeTableName: true,
      underscored: true,
    }
  );
};

export default adminUsersModel;
