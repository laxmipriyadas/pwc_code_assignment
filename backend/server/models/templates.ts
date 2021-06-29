import { TEMPLATES } from "../constants/modelConstants";
const Sequelize = require("sequelize");

const templatesModel = (sequelize) => {
  return sequelize.define(
    TEMPLATES,
    {
      template_id: {
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      template_name: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      template_content: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      count: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        defaultValue: 0,
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
          fields: ["template_id"],
        },
      ],
      freezeTableName: true,
      underscored: true,
    }
  );
};

export default templatesModel;
