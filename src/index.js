#!/usr/local/bin/node
/*
 * 参数处理
 * @Author: jiangxiaowei
 * @Date: 2020-09-29 16:39:41
 * @Last Modified by: jiangxiaowei
 * @Last Modified time: 2020-10-10 18:35:29
 */
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const execa = require('execa')
const chalk = require('chalk')
const ora = require('ora')
const { safeDump } = require('js-yaml')
const initCommander = require('./commander')
const questions = require('./questions')
const delteBranch = require('./delete')
const { getBrachList } = require('./utils')
const { log } = console
const spinner = new ora('统计待删除分支信息')

/**
 * 分支删除
 * @param {object} options 兜底值
 * @param {object} answers 配置文件/交互式/参数获取到的对象
 */
const startInit = async (options, answers) => {
  creaetConfig({ ...options, ...answers })
  const {
    main,
    clearPosition,
    remoteName,
    // user,
    // isReg,
    // branchRegStr,
    // isIgnore,
    // ignoreRegStr
  } = { ...options, ...answers }
  // 待删除的远程分支
  let branchRemote = ''
  // 待删除的本地分支
  let branchLocal = ''
  spinner.start()
  // 是否会删除远程分支
  switch (clearPosition) {
    case 'local':
      branchLocal = (await execa('git', ['branch', '--merged', main])).stdout

      break
    case 'remote':
      // TODO: git pull ora loading
      // 删除无效的本地远程分支。
      await execa('git', ['remote', 'prune', remoteName])
      branchRemote = (await execa('git', ['branch', '-r', '--merged', main]))
        .stdout
      break
    case 'all':
      // TODO: git pull ora loading
      // 删除无效的本地远程分支。
      await execa('git', ['remote', 'prune', remoteName])
      branchLocal = (await execa('git', ['branch', '--merged', main])).stdout
      branchRemote = (await execa('git', ['branch', '-r', '--merged', main]))
        .stdout
      break
    default:
      break
  }
  delteBranch(getBrachList(branchLocal), getBrachList(branchRemote), {
    ...options,
    ...answers,
    spinner,
  })
}

/**
 * 判断配置文件是否存在，不存在则提示
 */
const exitConfig = () => {
  // 配置文件不存在，提示init创建
  !fs.existsSync(path.resolve(__dirname, '.branchclear.yml')) &&
    log(
      chalk.yellow(
        '.branchclear.yml不存在，请手动创建或者branchclear --init [-y]创建\n详细请参考branchclear --help'
      )
    ) &&
    process.exit(1)
}

/**
 *
 * @param {*} answers
 */
const creaetConfig = (answers) => {
  const data = safeDump(answers, { sortKeys: true })
  fs.writeFileSync(path.resolve(__dirname, './.branchclear.yml'), data)
}

// 初始化
;(async () => {
  try {
    // 设置默认git账号。用来控制仅删除当前账号下的分支，避免删除其他人分支
    const res = await execa('git', ['config', 'user.name'])
    const index = questions.findIndex((item) => item.name === 'user')
    questions[index].default = res.stdout

    // 兜底值
    const options = {
      main: 'master',
      // 默认当前.git 账户
      user: res.stdout,
      // 'local' | 'remote' | 'all'
      clearPosition: 'local',
      remoteName: 'origin',
      isReg: false,
      branchRegStr: '',
      isIgnore: false,
      ignoreRegStr: '',
    }
    // 初始化参数帮助
    const { yes, init, answers } = initCommander(res.stdout)
    if (init) {
      // 交互问答创建.branchclear.js
      !yes &&
        inquirer
          .prompt(questions)
          .then(startInit.bind(this, options))
          .catch((error) => {
            log(chalk.red(error))
            process.exit(1)
          })
      // 根据兜底值创建配置文件
      yes && startInit(options, answers)
    } else {
      exitConfig()
      // TODO 不使用配置项，直接使用命令
      // TODO 使用配置项
      // cli参数优先于文件配置中的选项
    }
  } catch (error) {
    log(chalk.red(error))
    process.exit(1)
  }
})()
