# 介绍

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

branchclear-cli 可以快速清理本地、远程、本地和远程已经合并到指定分支（默认为`master`）的分支。

## 开始使用

1. 安装
   `npm i -D branchclear-cli` or `yarn add branchclear-cli -D`
2. 初始化配置
   `npx branchclear-cli --init` 初始化配置，也可使用`npx branchclear-cli --init -y`跳过交互生成默认配置。

   ![npx branchclear-cli --init gif图片](./assets/init.gif)

   上述命令将会在项目根目录创建`.branchclear.yml`文件

   下面为`npx branchclear-cli --init -y`创建的默认`.branchclear.yml`文件

   ```yaml
   # 只删除正则匹配的分支 正则字符串 isReg必须为true才可设置
   branchRegStr: ''
   # 清除本地、远程、本地和远程分支 local 本地、remote 远程、all 本地和远程
   ÷clearPosition: local
   # 清除分支类型 all 清除所有用户已经合并的分支 current 只删除当前用户已经合并的分支 custom 自定义删除分支的用户
   clearType: current
   # 忽略的分支正则 isIgnore必须为true才可设置
   ignoreRegStr: ''
   # 是否有忽略的分支
   isIgnore: false
   # 是否只删除匹配的分支
   isReg: false
   # 主分支的分支名
   main: master
   # 远程仓库名字
   remoteName: origin
   # 只删除当前帐号创建的分支
   user: mengshang918
   ```

3. 使用`yarn clear`或者`npm run clear`

   ```json
   {
     "scripts": {
       "clear": "branchclear"
     }
   }
   ```

![清除分支交互 gif](./assets/clear.gif)

## 参数

```shell
Options:
  -V,--version                         当前版本号
  -y,--yes                             所有选项使用默认值
  --init                               生成.branchclear.json配置文件
  -m, --main <master>                  主分支名称 (default: "master")
  -u,--user <user>                     只删除指定git用户创建的分支 (default: "jiangxiaowei")
  -p,--position <local|remote|all>     删除类型 (default: "local")
  -remote,--remotename <origin>        远程仓库名字 (default: "origin")
  --branchreg <RegExp>                 匹配的分支正则
  --ignorereg <RegExp>                 忽略的分支正则
  -t,--cleartype <all|current|custom>  删除所有用户合并分支|只删除当前用户分支|删除自定义用户分支 (default: "current")
  -h, --help                           display help for command
```

使用参数前必须先使用`--init`创建`.branchclear.yml`配置文件。

参数优先级高于配置文件优先级

## 提示

当前所在分支不会被删除，主分支不会被删除。正则匹配的分支会/不会被删除

## 规划

[todo](https://github.com/mengshang918/branchclear-cli/projects/1)
