import { TEMPLATE_FIELDS } from "../constants/modelConstants";
const Sequelize = require("sequelize");

const templatesfieldsModel = (sequelize) => {
  return sequelize.define(
    TEMPLATE_FIELDS,
    {
      id: {
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        primaryKey: true,
        unique: true,
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

export default templatesfieldsModel;
