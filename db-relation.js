const { Relation } = require('./db');
const { Op } = require('sequelize');

/**
 * 新增关系;
 */
async function addRelation(relationData) {
  return Relation.create({ ...relationData })
}

// 因一个人员只能存在一个 父亲, 所以 整张表中 personToId 是唯一的。
async function getRelationByTo(relationData) {
  return Relation.findOne({ 
    where: {
      personToId: relationData.personToId
    }
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
    let relation = await localRelation.update(relationData)
    return relation;
  } else {
    throw new Error('更新失败，未能查找到数据!');
  }
}


module.exports = {
  addRelation,
  getRelationByTo,
  deleteRelation,
  editRelation
}
