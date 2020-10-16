# 介绍

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
branchclear-cli 可以快速清理本地或远程已经合并到 master 的分支。

## 开始使用

1. 安装
   `npm i -D branchclear-cli` or `yarn add branchclear-cli -D`
2. 初始化配置
   `branchclear --init` 初始化配置
3. 配合 husky，git-push 钩子。

```
{
  "husky": {
    "hooks": {
      "pre-push": "branchclear-cli"
    }
  }
}
```

## 提示

当前所在分支不会被删除，主分支不会被删除。正则匹配的分支会（不会）被删除
