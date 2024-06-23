const { Person } = require('./db');
const { Op } = require('sequelize');

/**
 * 查询符合过滤条件的人员列表;
 * 
 * @param {Object} params
 * @param {number} params.page      页码
 * @param {number} params.pageSize  每页数据量
 * @param {number} params.puOrder   谱序
 *  
 * @returns Promise<{count: number|number[], rows: Model[]}>
 */
async function getAllPersons(params) {
  let tmpDataIn = {}
  if (params.puOrder > 0) {
    tmpDataIn.where = {
      puOrder: {
        [Op.eq]:params.puOrder
      }
    }
  }
  const startIdx = (params.page - 1) * params.pageSize
  tmpDataIn.limit = startIdx
  tmpDataIn.offset = startIdx + params.pageSize
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

}

/**
 * 编辑人员;
 * 
 * @param {*} params 
 */
async function editPerson(params){

}

/**
 * 查询 单个人员;
 * 
 * @param {*} params 
 */
async function getSinglePerson(params){

}

module.exports = {
  addPerson
}


