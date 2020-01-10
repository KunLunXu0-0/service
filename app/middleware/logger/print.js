/**
 * 控制台打印
 */
const _ = require('lodash');
const moment = require('moment');
const colors = require('colors');
const start = colors.red(`[*${moment().format('YYYY-MM-DDD:HH:mm:ss')}*]`);

// 操作名称_黑名单操作: 下列 operationName 的请求将不打印日志
const OPERATION_NAME_BACL_LIST = [
  'IntrospectionQuery',
];

/**
 * 打印分割线(字符图案)
 */
const printDividingLine = () => {
  const charPattern = [
    "              _       _     _                             ",
    "   _ __  _ __(_)_ __ | |_  | | ___   __ _  __ _  ___ _ __ ",
    "  | '_ \\| '__| | '_ \\| __| | |/ _ \\ / _` |/ _` |/ _ \\ '__|",
    "  | |_) | |  | | | | | |_  | | (_) | (_| | (_| |  __/ |   ",
    "  | .__/|_|  |_|_| |_|\\__| |_|\\___/ \\__, |\\__, |\\___|_|   ",
    "  |_|                               |___/ |___/           ", "",
    "  ----------------------- 日志打印 ------------------------"
  ];
  console.log(`\n${charPattern.join('\n').cyan}\n`);
}

/**
 * 打印请求参数
 * @param {Object} ctx 上下文
 */
const printRequest = ctx => {
  const { query, ... reset } = _.get(ctx, 'request.body', {});
  const params = JSON.stringify({
    method: ctx.request.method,
    url: ctx.request.url,
    ... reset,
  }, null, 4);
  console.log(start, colors.cyan('请求参数: '), colors.yellow(params), '\n');
  console.log(start, colors.cyan('请求文档: '), colors.yellow(query), '\n');
}

/**
 * 打印响应参数
 * @param {Object} ctx 上下文
 */
printResponse = ctx => {
  try {
    const body = _.isString(ctx.body) ? JSON.parse(ctx.body) : ctx.body;
    const params = JSON.stringify({
      status: ctx.status,
      body,
    }, null, 4);
    console.log(start, colors.cyan('响应数据: '), colors.yellow(params), '\n');
  } catch (e){}
}

module.exports = async ctx => {
  const operationName = _.get(ctx, 'request.body.operationName');
  if (OPERATION_NAME_BACL_LIST.includes(operationName)) { return false; }
  printDividingLine();
  printRequest(ctx);
  printResponse(ctx);
}
