#!/usr/bin/env node
;(async () => {
  try {
    await require('../src/index.js')
  } catch (error) {
    console.error('发生错误\n' + error)
    process.exit(1)
  }
})()
