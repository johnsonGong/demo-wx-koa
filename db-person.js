const { Person } = require('./db');
const { Op } = require('sequelize');

/**
 * 查询符合过滤条件的人员列表;
 * 
 * @param {Object} params
 * @param {String} params.name      谱名 or 常用名
 * @param {number} params.pageNo    页码
 * @param {number} params.pageSize  每页数据量
 * @param {number} params.puOrder   谱序
 *  
 * @returns Promise<{count: number|number[], rows: Model[]}>
 */
async function getAllPersons(params) {
  let tmpDataIn = {}

  let tmpWhere = {}
  const tmpFormData = params.searchForm
  if (tmpFormData.name) {
    // 谱名 or 常用名
    tmpWhere = {
      [Op.or]: [{
        name: {
          [Op.substring]: tmpFormData.name
        }
      },{
        name2: {
          [Op.substring]: tmpFormData.name
        }
      }]
    }
  }

  if (tmpFormData.puOrder > 0) {
    // 谱序
    tmpWhere.puOrder = {
      [Op.eq]:tmpFormData.puOrder
    }
  }

  if (tmpFormData.branchCode) {
    // 支系
    tmpWhere.branchCode = {
      [Op.eq]:tmpFormData.branchCode
    }
  }

  tmpDataIn.where = tmpWhere

  const startIdx = (params.pageNo - 1) * params.pageSize
  tmpDataIn.limit = params.pageSize
  tmpDataIn.offset = startIdx

  return Person.findAndCountAll(tmpDataIn)
}

/**
 * 新增人员;
 */
async function addPerson(personData) {
  return Person.create({ ...personData })
}

/**
 * 删除人员;
 * 
 * @param {*} params 
 */
async function deletePerson(params){
  return Person.destroy({
    where: {
      uuid: params.uuid
    }
  })
}

/**
 * 编辑人员;
 * 
 * @param {*} params 
 */
async function editPerson(params){
  return Person.update( params.formData, {
    where: {
      uuid: params.uuid
    }
  })
}

/**
 * 查询 单个人员;
 * 
 * @param {*} params 
 */
async function getSinglePerson(params){
  return Person.findOne({
    where: {
      uuid: params.uuid
    }
  })
}

module.exports = {
  addPerson,
  getAllPersons,
  deletePerson,
  editPerson,
  getSinglePerson
}


