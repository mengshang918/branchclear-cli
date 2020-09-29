/*
 * 删除分支
 * @Author: jiangxiaowei
 * @Date: 2020-09-29 16:39:30
 * @Last Modified by: jiangxiaowei
 * @Last Modified time: 2020-09-29 17:09:41
 */
/* {
  main: 'master',
  user: 'mengshang918',
  clearPosition: 'local',
  remoteName: 'origin',
  isReg: false,
  branchReg: '',
  isIgnore: false,
  ignoreReg: ''
} */

const execa = require('execa')
const { log } = console

module.exports = (branchLocal, branchRemote, options) => {
  const { remoteName } = options
  // TODO: 先校验当前分支是否存在，不存在跳过。并提示不存在的分支
  branchLocal.map(async (item) => {
    const res = await execa('git', ['branch', '-D', item])
    log(res)
  })
  branchRemote.map(async (item) => {
    const res = await execa('git', ['push', remoteName, '--delete', item])
    log(res)
  })
  log(branchLocal)
  log(branchRemote)
  log(options)
}
