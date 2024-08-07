const { Relation } = require('./db');
const { Op } = require('sequelize');

/**
 * 新增关系;
 */
async function addRelation(relationData) {
  return Relation.create({ ...relationData })
}

// 因一个人员只能存在一个 父亲, 所以 整张表中 personToId 是唯一的。
async function getRelationById(relationData) {
  var whereObj = {}
  if (relationData.uuid) {
    // 优先使用 uuid
    whereObj.uuid = relationData.uuid
  } else if(relationData.personToId) {
    // 其次使用 personToId
    whereObj.personToId = relationData.personToId
  }

  return Relation.findOne({ 
    where: whereObj
   })
}

async function deleteRelation(relationData){
  return Relation.destroy({
    where: {
      uuid: relationData.uuid
    }
  })
}

async function editRelation(relationData){
  let localRelation = await Relation.findOne({
    where: {
      personToId: relationData.personToId
    }
  })

  if (localRelation) {
    // 存在
    return localRelation.update(relationData);
  } else {
    throw new Error('更新失败，未能查找到数据!');
  }
}

/**
 * 查询符合过滤条件的 关系列表;
 * 
 * @param {Object} params
 * @param {String} params.name      s上辈or下辈的名称（谱名 or 常用名）
 * @param {number} params.pageNo    页码
 * @param {number} params.pageSize  每页数据量
 * @param {number} params.puOrder   谱序
 *  
 * @returns Promise<{count: number|number[], rows: Model[]}>
 */
async function getRelationList(params) {

  let tmpDataIn = {}

  let tmpWhere = {}
  const tmpFormData = params.searchForm
  if (tmpFormData.name) {
    // 谱名 or 常用名
    tmpWhere = {
      [Op.or]: [{
        personFromName: {
          [Op.substring]: tmpFormData.name
        }
      },{
        personFromName2: {
          [Op.substring]: tmpFormData.name
        }
      },{
        personToName: {
          [Op.substring]: tmpFormData.name
        }
      },{
        personToName2: {
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
  tmpDataIn.order = [['updatedAt', 'DESC']]

  return Relation.findAndCountAll(tmpDataIn)
}


module.exports = {
  addRelation,
  getRelationById,
  deleteRelation,
  editRelation,
  getRelationList
}
