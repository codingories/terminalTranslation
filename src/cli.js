const {Command} = require('commander');
const {translate} = require('./main')

// import {translate} from "./main"; // 会报错


// const program = new commander.Command();
const program = new Command();
// console.log(program)
program.version('0.0.1')
  .name('fy')
  .usage('<English>') // <必须选 [可选
  .arguments('<English>')
  .action(function (english) {
    console.log(english)
    translate(english)
  });
program.parse(process.argv);
