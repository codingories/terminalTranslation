import * as https from 'https'
import * as querystring from 'querystring'
import md5 = require('md5')
import {appId, appSecret} from './private'

export const translate = (word) => {
  // console.log(md5('1')) // 引入不了，因为没有typescript类型文件,yarn add --dev @types/md5解决类型问题
  const salt = Math.random()
  const sign = md5(appId + word + salt + appSecret) // appSecret 一般都是放在服务器

  const query: string = querystring.stringify({
    q: word,
    from: 'en',
    to: 'zh',
    appid: appId+1,
    salt: salt, // 假的随机数
    sign: sign
    // ?q=banana&from=en&to=zh&appid=20200426000430230&salt=1435660288&sign=64f66d6aff1391bdd49775fc2824b9e6
  }) // 构造查询字符串
  const options = {
    hostname: 'api.fanyi.baidu.com',
    port: 443,
    path: '/api/trans/vip/translate?' + query,
    method: 'GET'
  }


  const request = https.request(options, (response) => {
    let chunks = []
    response.on('data', (chunk) => {
      chunks.push(chunk) // data 就是每次下载得到数据
    })
    response.on('end', () => {
      const string = Buffer.concat(chunks).toString() // end,就是把每次下载完的数据合起来
      type BaiduResult = {
        error_code?: string; // 第二个ts语法，:前面+？
        error_msg?: string;
        from: string;
        to: string;
        trans_result:{ src: string, dst: string }[]
      }
      const object: BaiduResult = JSON.parse(string);

      if(object.error_code){
        if(object.error_code === '52003'){
          console.error('用户认证失败')
        }else{
          console.error(object.error_msg)
        }
        process.exit(2); // 退出当前进程
      }else{
        console.log(object.trans_result[0].dst)
        process.exit(0); // 退出当前进程,0 表示正确
      }
    })
  }) // 通过https.request和百度服务器做交互

  request.on('error', (e) => {
    console.error(e)
  })
  request.end()
}
