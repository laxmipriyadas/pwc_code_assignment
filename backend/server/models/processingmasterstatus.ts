import { PROCESSING_MASTER_STATUS } from "../constants/modelConstants";
const Sequelize = require("sequelize");

const processingMasterStatusModel = (sequelize) => {
  return sequelize.define(
    PROCESSING_MASTER_STATUS,
    {
      status_id: {
        type: Sequelize.INTEGER(20),
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
    },
    {
      indexes: [
        {
          fields: ["status_id"],
        },
      ],
      freezeTableName: true,
      underscored: true,
    }
  );
};

export default processingMasterStatusModel;
