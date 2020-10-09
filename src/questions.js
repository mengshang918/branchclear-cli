const { validateReg } = require('./utils')

module.exports = [
  {
    type: 'input',
    message: '请输入你的的主分支名称',
    name: 'main',
    default: 'master',
  },
  {
    type: 'input',
    message: '请输入git账号,仅会删除git账号下的分支',
    name: 'user',
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
