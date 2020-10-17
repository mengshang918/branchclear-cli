#!/usr/local/bin/node
/*
 * 参数处理
 * @Author: jiangxiaowei
 * @Date: 2020-09-29 16:39:41
 * @Last Modified by: jiangxiaowei
 * @Last Modified time: 2020-10-17 16:14:02
 */
const fs = require('fs')
const inquirer = require('inquirer')
const execa = require('execa')
const chalk = require('chalk')
const ora = require('ora')
const { safeDump, safeLoad } = require('js-yaml')
const initCommander = require('./commander')
const questions = require('./questions')
const delteBranch = require('./delete')
const { getBrachList } = require('./utils')
const { log } = console
const spinner = new ora('统计待删除分支信息')

/**
 * 分支删除
 * @param {object} options 兜底值
 * @param {object} answers 交互式获取到的对象
 * @param {object} answers 配置文件获取到的对象
 */
const startInit = async (options, answers, config) => {
  const {
    main,
    clearPosition,
    remoteName,
    // user,
    // isReg,
    // branchRegStr,
    // isIgnore,
    // ignoreRegStr
  } = { ...options, ...config, ...answers }
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
    ...config,
    ...answers,
    spinner,
  })
}

/**
 * 判断配置文件是否存在，不存在则提示
 */
const exitConfig = () => {
  // 配置文件不存在，提示init创建
  !fs.existsSync('./.branchclear.yml') &&
    log(
      chalk.yellow(
        '.branchclear.yml不存在，请手动创建或者branchclear --init [-y]创建\n详细请参考branchclear --help'
      )
    ) &&
    process.exit(1)
}

/**
 * 生成配置项
 * @param {*} answers
 */
const creaetConfig = (answers) => {
  const data = safeDump(answers, { sortKeys: true })
  fs.writeFileSync('./.branchclear.yml', data)
}

/**
 * 选用哪种方式生成配置项。直接生成or交互方式生成
 * @param {boolean} showUI 是否使用交互方式生成配置项
 * @param {object} options 配置兜底值
 * @param {object} answers 参数配置值or交互问题配置值
 */
const createConfigWay = (showUI, options, answers) => {
  !showUI
    ? inquirer
        .prompt(questions)
        .then((answers) => {
          creaetConfig({ ...options, ...answers })
        })
        .catch((error) => {
          log(chalk.red(error))
          process.exit(1)
        })
    : creaetConfig({ ...options, ...answers })
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
      // 判断配置项是否存在，存在则提示确认覆盖;不存在生成
      fs.existsSync('./.branchclear.yml')
        ? inquirer
            .prompt([
              {
                type: 'confirm',
                message: '当前项目已经存在.branchclear.yml文件，是否重新生成？',
                default: false,
                name: 'confirmInit',
              },
            ])
            .then((answer) => {
              !answer.confirmInit && process.exit(1)
              createConfigWay(yes, options, answers)
            })
        : createConfigWay(yes, options, answers)
    } else {
      exitConfig()
      const config = safeLoad(fs.readFileSync('./.branchclear.yml'))
      startInit(options, answers, config)
    }
  } catch (error) {
    log(chalk.red(error))
    process.exit(1)
  }
})()
