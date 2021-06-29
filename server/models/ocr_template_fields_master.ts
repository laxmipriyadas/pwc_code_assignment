import { OCR_TEMPLATE_MASTER } from "../constants/modelConstants";
const Sequelize = require("sequelize");

const ocrtemplatemasterModel = (sequelize) => {
  return sequelize.define(
    OCR_TEMPLATE_MASTER,
    {
      id: {
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.INTEGER(50),
        allowNull: false,
      },
      content: {
        type: Sequelize.JSON,
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

export default ocrtemplatemasterModel;
