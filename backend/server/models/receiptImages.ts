import { RECEIPT_IMAGES } from "../constants/modelConstants";
const Sequelize = require("sequelize");

const receiptImagesModel = (sequelize) => {
  return sequelize.define(
    RECEIPT_IMAGES,
    {
      id: {
        type: Sequelize.BIGINT(20),
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      image_url: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
    },
    {
      indexes: [
        {
          fields: ["receipt_id"],
        },
      ],
      freezeTableName: true,
      underscored: true,
    }
  );
};

export default receiptImagesModel;
