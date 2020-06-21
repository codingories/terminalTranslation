const {Command} = require('commander')
// const {translate} = require('./main')

import {translate} from './main' // js会报错，必须ts


// const program = new commander.Command();
const program = new Command()
// console.log(program)
program.version('0.0.1')
  .name('fy')
  .usage('<English>') // <必须选 [可选
  .arguments('<English>')
  .action(function (english) {
    translate(english)
  })
program.parse(process.argv)
