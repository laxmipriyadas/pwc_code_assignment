import receiptLogModel from "./receiptlog";
import receiptModel from "./receipts";
import receiptImagesModel from "./receiptImages";
import receiptItemModel from "./receiptItems";
import storesModel from "./stores";
import storealiasModel from "./storealias";
import adminUsersModel from "./adminusers";
import rolesModel from "./roles";
import productsModel from "./products";
import productaliasModel from "./productalias";
import processingMasterStatusModel from "./processingmasterstatus";
import templatesfieldsModel from "./template_fields";
import ocrtemplatemasterModel from "./ocr_template_fields_master";
import templatesModel from "./templates";
import userTokenModel from "./usertoken";
import credentialsModel from "./credentials";
const Sequelize = require("sequelize");

// receipt,templates,template_fields,ocr_template_field_master

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    // logging: false,
    dialect: process.env.DB,
    operatorsAliases: false,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    pool: {
      max: 1000,
      min: 0,
      idle: 200000,
      acquire: 1000000,
    },
    define: {
      timestamps: false,
    },
  }
);

const receiptLog = receiptLogModel(sequelize);
const receipts = receiptModel(sequelize);
const stores = storesModel(sequelize);
const storealias = storealiasModel(sequelize);
const receiptImages = receiptImagesModel(sequelize);
const receiptItems = receiptItemModel(sequelize);
const adminusers = adminUsersModel(sequelize);
const roles = rolesModel(sequelize);
const products = productsModel(sequelize);
const productalias = productaliasModel(sequelize);
const processingMasterStatus = processingMasterStatusModel(sequelize);
const templates = templatesModel(sequelize);
const templatefields = templatesfieldsModel(sequelize);
const ocrtemplatefieldsmaster = ocrtemplatemasterModel(sequelize);
const usertoken = userTokenModel(sequelize);
const credentials = credentialsModel(sequelize);
const usertokens = userTokenModel(sequelize);

receipts.belongsTo(processingMasterStatus, {
  foreignKey: "status_id",
  targetKey: "status_id",
});

processingMasterStatus.hasMany(receipts, {
  foreignKey: { name: "status_id", allowNull: true, defaultValue: false },
  sourceKey: "status_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

receipts.hasMany(receiptItems, {
  foreignKey: { name: "receipt_id", allowNull: true },
  sourceKey: "receipt_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

receipts.hasMany(receiptImages, {
  foreignKey: { name: "receipt_id", allowNull: true },
  sourceKey: "receipt_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

receipts.belongsTo(stores, {
  foreignKey: "store_id",
  targetKey: "store_id",
});
receipts.belongsTo(adminusers, {
  foreignKey: "submitted_by",
  targetKey: "admin_id",
});
receipts.belongsTo(templates, {
  foreignKey: "template_id",
  targetKey: "template_id",
});
products.hasMany(receiptItems, {
  foreignKey: { name: "product_id", allowNull: true },
  sourceKey: "product_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
receiptItems.belongsTo(products, {
  foreignKey: "product_id",
  targetKey: "product_id",
});
products.hasMany(productalias, {
  foreignKey: { name: "product_id", allowNull: true },
  sourceKey: "product_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

receiptImages.belongsTo(receipts, {
  foreignKey: "receipt_id",
  targetKey: "receipt_id",
});

adminusers.hasMany(receipts, {
  foreignKey: { name: "submitted_by", allowNull: true },
  sourceKey: "admin_id",
});

adminusers.belongsTo(roles, {
  foreignKey: { name: "roll_id", allowNull: true },
  sourceKey: "roll_id",
});

stores.hasMany(receipts, {
  foreignKey: { name: "store_id", allowNull: true },
  sourceKey: "store_id",
});
stores.hasMany(storealias, {
  foreignKey: { name: "store_id", allowNull: true },
  sourceKey: "store_id",
});

templates.hasMany(templatefields, {
  foreignKey: { name: "template_id", allowNull: true },
  sourceKey: "template_id",
});
templatefields.belongsTo(templates, {
  foreignKey: "template_id",
  targetKey: "template_id",
});
templatefields.belongsTo(ocrtemplatefieldsmaster, {
  foreignKey: "id_1",
  targetKey: "id",
});

receiptLog.belongsTo(receipts, {
  foreignKey: { name: "receipt_id", allowNull: true },
  sourceKey: "receipt_id",
});
receiptLog.belongsTo(adminusers, {
  foreignKey: { name: "action_performed_by", allowNull: true },
  sourceKey: "admin_id",
});

export {
  sequelize,
  receiptLog,
  receipts,
  receiptImages,
  receiptItems,
  processingMasterStatus,
  templates,
  templatefields,
  ocrtemplatefieldsmaster,
  adminusers,
  roles,
  stores,
  storealias,
  products,
  productalias,
  credentials,
  usertokens,
};
