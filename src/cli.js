const { Command } = require('commander');


// const program = new commander.Command();
const program = new Command();
// console.log(program)
program.version('0.0.1')
  .name('fy')
  .usage('<english>') // <必须选 [可选

program.parse(process.argv);
