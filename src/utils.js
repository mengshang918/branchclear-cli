/*
 * 公共方法
 * @Author: jiangxiaowei
 * @Date: 2020-09-29 16:51:11
 * @Last Modified by: jiangxiaowei
 * @Last Modified time: 2020-10-09 18:36:35
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
 * 判断字符串是否是正则
 * @param {string} item 输入的正则字符串
 */
const validateReg = (item) => {
  let errMsg = '请输入正确的正则，例如/release-/gi'
  try {
    return eval(item) instanceof RegExp || errMsg
  } catch (error) {
    return errMsg
  }
}

module.exports = {
  getBrachList,
  validateReg,
}
