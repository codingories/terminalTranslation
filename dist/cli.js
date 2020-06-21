"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Command = require('commander').Command;
// const {translate} = require('./main')
var main_1 = require("./main"); // js会报错，必须ts
// const program = new commander.Command();
var program = new Command();
// console.log(program)
program.version('0.0.1')
    .name('fy')
    .usage('<English>') // <必须选 [可选
    .arguments('<English>')
    .action(function (english) {
    main_1.translate(english);
});
program.parse(process.argv);
