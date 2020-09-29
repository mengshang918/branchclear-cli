#!/usr/local/bin/node
/*
 * 参数处理
 * @Author: jiangxiaowei
 * @Date: 2020-09-29 16:39:41
 * @Last Modified by: jiangxiaowei
 * @Last Modified time: 2020-09-29 18:09:35
 */
const inquirer = require('inquirer')
const execa = require('execa')
const chalk = require('chalk')
const questions = require('./questions')
const delteBranch = require('./delete')
const { getBrachList } = require('./utils')
const { log } = console

// 交互方式
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
      branchReg: '',
      isIgnore: false,
      ignoreReg: '',
    }
    // 交互问答
    inquirer
      .prompt(questions)
      .then(async (answers) => {
        const {
          main,
          clearPosition,
          remoteName,
          // user,
          // isReg,
          // branchReg,
          // isIgnore,
          // ignoreReg
        } = { ...options, ...answers }
        // 待删除的远程分支
        let branchRemote = ''
        // 待删除的本地分支
        let branchLocal = ''
        // 是否会删除远程分支
        switch (clearPosition) {
          case 'local':
            branchLocal = (await execa('git', ['branch', '--merged', main]))
              .stdout

            break
          case 'remote':
            // TODO: git pull ora loading
            // 删除无效的本地远程分支。
            await execa('git', ['remote', 'prune', remoteName])
            branchRemote = (
              await execa('git', ['branch', '-r', '--merged', main])
            ).stdout
            break
          case 'all':
            // TODO: git pull ora loading
            // 删除无效的本地远程分支。
            await execa('git', ['remote', 'prune', remoteName])
            branchLocal = (await execa('git', ['branch', '--merged', main]))
              .stdout
            branchRemote = (
              await execa('git', ['branch', '-r', '--merged', main])
            ).stdout
            break
          default:
            break
        }

        delteBranch(getBrachList(branchLocal), getBrachList(branchRemote), {
          ...options,
          ...answers,
        })
      })
      .catch((error) => {
        log(chalk.red(error))
        process.exit(1)
      })
  } catch (error) {
    log(chalk.red(error))
    process.exit(1)
  }
})()

// 配置方式

// 参数方式
// branchclear --int 根据交互方式生成配置方式
// 其它参数
