/*
 * 公共方法
 * @Author: jiangxiaowei
 * @Date: 2020-09-29 16:51:11
 * @Last Modified by: jiangxiaowei
 * @Last Modified time: 2020-09-29 16:59:29
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

module.exports = {
  getBrachList,
}
