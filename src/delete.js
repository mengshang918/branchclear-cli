/*
 * 删除分支
 * @Author: jiangxiaowei
 * @Date: 2020-09-29 16:39:30
 * @Last Modified by: jiangxiaowei
 * @Last Modified time: 2020-09-29 18:16:09
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
  const { remoteName, main } = options
  // TODO: 先校验当前分支是否存在，不存在跳过。并提示不存在的分支
  // 本地正则过滤
  const reg = new RegExp(`^\\*|${main}`)
  // 远程正则过滤
  const regRemote = new RegExp(`HEAD|${main}`)
  console.log(reg)
  branchLocal
    .filter((item) => !reg.test(item))
    .map(async (item) => {
      const res = await execa('git', ['branch', '-D', item])
      log(res)
    })
  branchRemote
    .filter((item) => !regRemote.test(item))
    .map(async (item) => {
      const res = await execa('git', [
        'push',
        remoteName,
        '--delete',
        item.replace(`${remoteName}/`, ''),
      ])
      log(res)
    })
  log(branchLocal)
  log(branchRemote)
  log(options)
}
