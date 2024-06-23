const { Sequelize, DataTypes } = require("sequelize");

// 从环境变量中读取数据库配置
const { MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_ADDRESS } = process.env;

const [host, port] = MYSQL_ADDRESS.split(":");

const sequelize = new Sequelize("nodejs_demo", MYSQL_USERNAME, MYSQL_PASSWORD, {
  host,
  port,
  dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
});

// 定义数据模型, 等价于数据库中的 表
const Counter = sequelize.define("Counter", {
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
});

const Person = sequelize.define("Person", {
  // mysql自动生成的 uuid
  uuid: {
    type: DataTypes.UUID,
    allowNull: false
  },
  // 唯一编号
  id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    primaryKey: true
  },
  // 分支编码
  branchCode: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  // 派序下标
  puOrder: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  // 谱名,如: 龚正甲
  name: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  // 常用名,如：龚壹甲
  name2: {
    type: DataTypes.STRING(10),
  },
  // 姓名, 表字
  name_zi: {
    type: DataTypes.STRING(10),
  },
  // 姓名, 号
  name_hao: {
    type: DataTypes.STRING(10),
  },
  // 配偶(夫 or 妻)
  partner: {
    type: DataTypes.STRING(10),
  },
  // 配偶, 续弦or改嫁
  partner_2: {
    type: DataTypes.STRING(10),
  },
  // 职业, 如: 医生
  job: {
    type: DataTypes.STRING(10),
  },
  // 学历
  study: {
    type: DataTypes.STRING(20),
  },
  // 生于 XX年
  dateBirth: {
    type: DataTypes.STRING(20),
  },
  // 卒于 XX年
  dateDie: {
    type: DataTypes.STRING(20),
  },
  // 性别: 1-男, 0-女
  gender: {
    type: DataTypes.STRING(10),
  },
  // 是否为继承人, 女性为 招婿&上门; 1-是, 0-否;
  isInherit:{
    type: DataTypes.STRING(10),
  },
  // 地址
  addr: {
    type: DataTypes.STRING(20),
  },
  detail: {
    type: DataTypes.STRING(100),
  }
})

// 数据库初始化方法
async function init() {
  await Counter.sync({ alter: true });
  await Person.sync({ alter: true })
}

// 导出初始化方法和模型
module.exports = {
  init,
  Counter,
  Person
};
