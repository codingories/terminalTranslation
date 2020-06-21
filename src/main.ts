import * as https from 'https'
import * as querystring from 'querystring'
import md5 = require('md5')

export const translate = (word) => {
  console.log('word')
  console.log(word)
  // console.log(md5('1')) // 引入不了，因为没有typescript类型文件,yarn add --dev @types/md5解决类型问题

  const appId = '???'
  const appSecret = '???'
  const salt = Math.random()
  const sign = md5(appId + word + salt + appSecret)

  const query: string = querystring.stringify({
    q: word,
    from: 'en',
    to: 'zh',
    appid: appId,
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
  console.log(options)


  const req = https.request(options, (res) => {
    res.on('data', (d) => {
      process.stdout.write(d)
    })
   }) // 通过https.request和百度服务器做交互

    req.on('error', (e) => {
      console.error(e)
    })
    req.end()
}
