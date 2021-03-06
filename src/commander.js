/*
 * 命令交互
 * @Author: jiangxiaowei
 * @Date: 2020-10-10 11:54:44
 * @Last Modified by: jiangxiaowei
 * @Last Modified time: 2020-10-23 15:11:10
 */
const { program } = require('commander')
const parseArgs = require('minimist')
const { version } = require('../package.json')
const { validateStrIsReg, hasKey } = require('./utils')

/**
 * @param {string} gitUser git用户
 */
module.exports = (gitUser) => {
  program
    .version(version, '-V,--version', '当前版本号')
    .option('-y,--yes', '所有选项使用默认值')
    .option('--init', '生成.branchclear.json配置文件')
    .option('-m, --main <master>', '主分支名称', 'master')
    .option('-u,--user <user>', '只删除指定git用户创建的分支', gitUser)
    .option('-p,--position <local|remote|all>', '删除类型', 'local')
    .option('-remote,--remotename <origin>', '远程仓库名字', 'origin')
    .option('--branchreg <RegExp>', '匹配的分支正则')
    .option('--ignorereg <RegExp>', '忽略的分支正则')
    .option(
      '-t,--cleartype <all|current|custom>',
      '删除所有用户合并分支|只删除当前用户分支|删除自定义用户分支',
      'current'
    )
    .parse(process.argv)

  const {
    position,
    branchreg,
    ignorereg,
    init,
    yes,
    main,
    cleartype,
    user,
    remotename,
  } = program
  if (
    !['local', 'remote', 'all'].includes(position) ||
    (branchreg && !validateStrIsReg(branchreg)) ||
    (ignorereg && !validateStrIsReg(ignorereg)) ||
    !['all', 'current', 'custom'].includes(cleartype)
  ) {
    program.help()
  }
  const args = parseArgs(process.argv.slice(2))
  return {
    answers: {
      ...(hasKey(args, ['m', 'main']) && { main }),
      ...(hasKey(args, ['u', 'user']) && { user }),
      ...(hasKey(args, ['t', 'cleartype']) && { clearType: cleartype }),
      ...(hasKey(args, ['p', 'position']) && { clearPosition: position }),
      ...(hasKey(args, ['remote', 'remotename']) && { remoteName: remotename }),
      isReg: !!branchreg,
      ...(!!branchreg && { branchRegStr: branchreg }),
      isIgnore: !!ignorereg,
      ...(!!ignorereg && { ignoreRegStr: ignorereg }),
    },
    init,
    yes,
  }
}
