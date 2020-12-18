/*
 * 删除分支
 * @Author: jiangxiaowei
 * @Date: 2020-09-29 16:39:30
 * @Last Modified by: jiangxiaowei
 * @Last Modified time: 2020-12-18 11:02:36
 */
/* {
  main: 'master',
  user: 'mengshang918',
  clearPosition: 'local',
  remoteName: 'origin',
  isReg: false,
  branchRegStr: '',
  isIgnore: false,
  ignoreRegStr: ''
} */

const execa = require('execa')
const chalk = require('chalk')
const inquirer = require('inquirer')
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
  branchRegStr: '', 正则匹配过滤分支
  isIgnore: false, 是否正则匹配忽略分支
  ignoreRegStr: '' 正则匹配忽略分支
}
 */
module.exports = async (branchLocal, branchRemote, options) => {
  const {
    remoteName,
    main,
    user,
    spinner,
    isReg,
    isIgnore,
    branchRegStr,
    ignoreRegStr,
    clearType,
    currentUser,
  } = options
  const filterUser = clearType === 'current' ? currentUser : user
  // 当前用户的本地分支
  let allLocalBranch = []
  // 当前用户的远程分支
  let allRemoteBranch = []
  try {
    // 匹配远程 具有Authored by的
    const regRemote = new RegExp(
      `^refs\\/remotes\\/${remoteName}\\/\\S+\\sAuthored\\sby:\\s${filterUser}$`
    )
    // 匹配local 具有Authored by的
    const regLocal = new RegExp(
      `^refs\\/heads\\/\\S+\\sAuthored\\sby:\\s${filterUser}$`
    )
    allLocalBranch = (
      await execa('git', [
        'for-each-ref',
        `--format=%(refname)%(if:equals=${filterUser})%(authorname)%(then) Authored by: %(authorname)%(end)`,
        'refs/heads/**',
      ])
    ).stdout
      .split(/\n|\r\n/)
      .filter((item) => regLocal.test(item))
      .map((item) => {
        return item
          .replace('refs/heads/', '')
          .replace(` Authored by: ${filterUser}`, '')
      })
    allRemoteBranch = (
      await execa('git', [
        'for-each-ref',
        `--format=%(refname)%(if:equals=${filterUser})%(authorname)%(then) Authored by: %(authorname)%(end)`,
        `refs/remotes/${remoteName}/**`,
      ])
    ).stdout
      .split(/\n|\r\n/)
      .filter((item) => regRemote.test(item))
      .map((item) => {
        return item
          .replace('refs/remotes/', '')
          .replace(` Authored by: ${filterUser}`, '')
      })
  } catch (error) {
    log(chalk.red(error))
    process.exit(1)
  }
  spinner.succeed('待删除分支统计结束')

  // 本地正则过滤 过滤当前分支和主分支
  const reg = new RegExp(`^\\*|${main}`)
  // 远程正则过滤 过滤当前分支和主分支
  const regRemote = new RegExp(`HEAD|${main}`)
  // 匹配用户输入的正则
  const branchReg = isReg && eval(branchRegStr)
  // 忽略用户输入的正则
  const ignoreReg = isIgnore && eval(ignoreRegStr)
  // 即将被删除的本地分支
  const deleteLocalBranch = branchLocal.filter(
    (item) =>
      !reg.test(item) &&
      (clearType === 'all' || allLocalBranch.includes(item)) &&
      (!branchReg || branchReg.test(item)) &&
      (!ignoreReg || !ignoreReg.test(item))
  )
  // 即将被删除的远程分支
  const deleteRemoteBranch = branchRemote.filter(
    (item) =>
      !regRemote.test(item) &&
      (clearType === 'all' || allRemoteBranch.includes(item)) &&
      (!branchReg || branchReg.test(item)) &&
      (!ignoreReg || !ignoreReg.test(item))
  )

  const questions = []
  deleteLocalBranch.length > 0 &&
    questions.push({
      type: 'checkbox',
      message: '下列本地分支将被删除（默认全部删除）\n',
      choices: deleteLocalBranch.map((item) => ({ name: item })),
      name: 'deleteLocal',
      default: deleteLocalBranch,
      pageSize: 20,
    })
  deleteRemoteBranch.length > 0 &&
    questions.push({
      type: 'checkbox',
      message: '下列远程分支将被删除，默认全部删除',
      choices: deleteRemoteBranch.map((item) => ({ name: item })),
      name: 'deleteRemote',
      default: deleteRemoteBranch,
      pageSize: 20,
    })

  inquirer
    .prompt(questions)
    .then((answers) => {
      const { deleteLocal, deleteRemote } = answers
      // 删除本地分支
      deleteLocal &&
        deleteLocal.length > 0 &&
        deleteLocal.map((item) => {
          spinner.start(`删除本地分支${item}`)
          execa.sync('git', ['branch', '-D', item])
          spinner.succeed()
        })
      // 删除远程分支
      deleteRemote &&
        deleteRemote.length > 0 &&
        deleteRemote.map((item) => {
          spinner.start(`删除远程分支${item.replace(`${remoteName}/`, '')}`)
          execa.commandSync(
            `git push ${remoteName} --delete ${item.replace(
              `${remoteName}/`,
              ''
            )} --no-verify`
          )
          spinner.succeed()
        })
      spinner.stop()
    })
    .catch((error) => {
      log(chalk.red(error))
      process.exit(1)
    })
}

// git for-each-ref --format="%(refname)%(if:equals=jiangxiaowei)%(authorname)%(then) Authored by: %(authorname)%(end)" 'refs/remotes/origin/**'
// git for-each-ref --format="%(refname)%(if:equals=jiangxiaowei)%(authorname)%(then) Authored by: %(authorname)%(end)" 'refs/heads/**'
// git for-each-ref --format="%(refname)%(if:equals=jiangxiaowei)%(authorname)%(then) Authored by: %(authorname)%(end)" 'refs/heads/**' 'refs/remotes/origin/**'
