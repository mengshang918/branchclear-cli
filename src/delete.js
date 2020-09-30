/*
 * 删除分支
 * @Author: jiangxiaowei
 * @Date: 2020-09-29 16:39:30
 * @Last Modified by: jiangxiaowei
 * @Last Modified time: 2020-09-30 12:41:27
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
const chalk = require('chalk')
const { log } = console

/**
 *
 * @param {array} branchLocal 本地合并到主分支的所有分支数组
 * @param {array} branchRemote 远程合并到主分支的所有分支数组
 * @param {object} options {
  main: 'master', 主分支
  user: 'mengshang918', 用户
  clearPosition: 'local', 清除位置
  remoteName: 'origin', 仓库remote
  isReg: false, 是否正则匹配过滤的分支
  branchReg: '', 正则匹配过滤分支
  isIgnore: false, 是否正则匹配忽略分支
  ignoreReg: '' 正则匹配忽略分支
}
 */
module.exports = async (branchLocal, branchRemote, options) => {
  const { remoteName, main, user } = options
  // 需要被删除的本地分支
  let allLocalBranch = []
  // 需要被删除的远程分支
  let allRemoteBranch = []
  try {
    allLocalBranch = (
      await execa('git', [
        'for-each-ref',
        `--format=%(refname)%(if:equals=${user})%(authorname)%(then) Authored by: %(authorname)%(end)`,
        'refs/heads/**',
      ])
    ).stdout.split(/\n|\r\n/)
    allRemoteBranch = (
      await execa('git', [
        'for-each-ref',
        `--format=%(refname)%(if:equals=${user})%(authorname)%(then) Authored by: %(authorname)%(end)`,
        'refs/remotes/origin/**',
      ])
    ).stdout.split(/\n|\r\n/)
  } catch (error) {
    log(chalk.red(error))
    process.exit(1)
  }
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
  log(allLocalBranch)
  log(allRemoteBranch)
  log(options)
}

// git for-each-ref --format="%(refname)%(if:equals=jiangxiaowei)%(authorname)%(then) Authored by: %(authorname)%(end)" 'refs/remotes/origin/**'
// git for-each-ref --format=%(refname)%(if:equals=jiangxiaowei)%(authorname)%(then) Authored by: %(authorname)%(end) 'refs/heads/**'
// git for-each-ref --format="%(refname)%(if:equals=jiangxiaowei)%(authorname)%(then) Authored by: %(authorname)%(end)" 'refs/heads/**' 'refs/remotes/origin/**'

// 在过滤有authored by的
// 匹配远程
// const regRemote = new RegExp('^refs\\/remotes\\/origin\\/\\S+\\sAuthored\\sby:\\sjiangxiaowei$')
// // 匹配local
// const regLocal = new RegExp('^refs\\/heads\\/\\S+\\sAuthored\\sby:\\sjiangxiaowei$')
