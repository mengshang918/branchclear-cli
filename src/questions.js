/*
 * 交互问题
 * @Author: jiangxiaowei
 * @Date: 2020-10-10 11:54:57
 * @Last Modified by: jiangxiaowei
 * @Last Modified time: 2020-10-22 18:05:27
 */
const { validateReg } = require('./utils')

module.exports = [
  {
    type: 'input',
    message: '请输入你的的主分支名称',
    name: 'main',
    default: 'master',
  },
  {
    type: 'list',
    message: '请选择删除分支类型',
    choices: [
      {
        name: '删除所有用户已经合并的分支',
        value: 'all',
      },
      {
        name: '只删除当前用户创建的分支',
        value: 'current',
      },
      {
        name: '自定义用户',
        value: 'custom',
      },
    ],
    name: 'clearType',
  },
  {
    type: 'input',
    message: '请输入git账号,仅会删除git账号下的分支',
    name: 'user',
    when: (answers) => answers.clearType === 'custom',
    default: '',
  },
  {
    type: 'list',
    message: '请选择删除类型',
    name: 'clearPosition',
    choices: ['local', 'remote', 'all'],
    defalult: 'local',
  },
  {
    type: 'input',
    message: '请输入远程仓库名字',
    name: 'remoteName',
    default: 'origin',
    when: (answers) => {
      return ['remote', 'all'].includes(answers.clearPosition)
    },
  },
  {
    type: 'confirm',
    message: '是否设置正则，只删除匹配的分支',
    name: 'isReg',
    default: false,
  },
  {
    type: 'input',
    message: '请输入需要匹配的分支正则（不填默认匹配所有）',
    name: 'branchRegStr',
    when: (answers) => {
      return answers.isReg
    },
    validate: validateReg,
  },
  {
    type: 'confirm',
    message: '是否需要设置忽略的分支',
    name: 'isIgnore',
    default: false,
  },
  {
    type: 'input',
    message: '请输入需要忽略的分支正则（不填默认不忽略分支）',
    name: 'ignoreRegStr',
    when: (answers) => {
      return answers.isIgnore
    },
    validate: validateReg,
  },
]
