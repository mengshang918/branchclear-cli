/*
 * 公共方法
 * @Author: jiangxiaowei
 * @Date: 2020-09-29 16:51:11
 * @Last Modified by: jiangxiaowei
 * @Last Modified time: 2020-10-21 18:59:47
 */

/**
 * 获取分支数组
 * @param {str} branchStr 分支字符串
 */
const getBrachList = (branchStr) => {
  return branchStr
    .split(/\n|\r\n/)
    .map((item) => item.trim())
    .filter((item) => item)
}

/**
 * 检测是否是正则
 * @param {string} item 正则字符串
 */
const validateStrIsReg = (item) => {
  return eval(item) instanceof RegExp
}

/**
 * inquirer判断字符串是否是正则
 * @param {string} item 输入的正则字符串
 */
const validateReg = (item) => {
  let errMsg = '请输入正确的正则，例如/release-/gi'
  try {
    return validateStrIsReg(item) || errMsg
  } catch (error) {
    return errMsg
  }
}

/**
 * 基本数据类型检测
 * @param {unknown} checkVar 待检测的变量
 * @returns {string} 基本数据类型：Object | Array | String | Number | Boolean | Null | Undefined
 */
const typeCheck = (checkVar) => {
  const typeClass = Object.prototype.toString.call(checkVar)

  return typeClass.split(' ')[1].split(']')[0]
}

/**
 * 判断obj中是否含有key这个属性
 * @param {object} obj 需要判断的对象
 * @param {string|Array} key 需要判断的key
 */
const hasKey = (obj, key) => {
  if (typeCheck(key) === 'Array') {
    return key.some((item) => Object.prototype.hasOwnProperty.call(obj, item))
  } else if (typeCheck(key) === 'String') {
    return Object.prototype.hasOwnProperty.call(obj, key)
  }
  return false
}

module.exports = {
  getBrachList,
  validateReg,
  validateStrIsReg,
  typeCheck,
  hasKey,
}
