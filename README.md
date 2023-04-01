# chatgpt-public
hello，大家好，我是`元宝`，今天终于抽空把自己写的chatgpt官网运行部署文档整理好了，**项目开源啦！！！**

开源不易，如果觉得项目有用，记得去项目(`https://github.com/LaiBaoYuan/chatgpt-public`)中点个`star🌟`支持`元宝`.

## 项目技术栈
- Vue3
- TypeScript
- TailwindCss
- NodeJs
- Express
- Redis
- Docker

## 项目声明
本地运行的前提是必须先获取`OpenAI`的`accessToken`或`apiKey`,才能访问他们提供的服务。
- accessToken的获取方式

浏览器登陆`https://chat.openai.com`,`f12`打开开发者模式，点击网络查看`session`接口请求返回数据,复制`accessToken`即可
![](https://files.mdnice.com/user/36542/3737c1e4-fe81-4e72-93f8-72f449920c25.png)

- apiKey的获取方式

浏览器登录`https://platform.openai.com`,点击右上角个人头像的`View API keys`,然后点击`Create new secret key`,成功后复制即可
![](https://files.mdnice.com/user/36542/c251001a-67f3-459d-8792-60f838a61305.png)

## 本地运行
> 本地运行的前提是要有**redis环境**
1. 修改`packages/server/src/client/redis.ts`的配置，前提是本地必须有安装`redis`环境，根据具体情况进行修改
```ts
export const client = createClient({
  url: `redis://${process.env.DOMAIN || 'localhost'}:6379`,
  password: process.env.REDIS_PASSWORD || ''
})
```

2. 修改`packages/server/src/client/sse.ts`的`apiKey`或`accessToken`，两种构造函数，二选一，**推荐第一种**，其中`http://localhost:7890`是代理地址，没有vpn代理是访问不到openai的接口。
```ts
/**
 * ChatGPTAPI构造
 */
const api = new ChatGPTAPI({
  apiKey: 'process.env.API_KEY!',
  fetch: (url, option) =>
    nodeFetch(
      url as any,
      { agent: proxy('http://localhost:7890'), ...option } as any
    ) as any
})


/**
 * ChatGPTUnofficialProxyAPI构造
 */
const api = new ChatGPTUnofficialProxyAPI({
  accessToken: process.env.ACCESS_TOKEN!,
  fetch: (url, option) =>
    nodeFetch(
      url as any,
      { agent: proxy('http://localhost:7890'), ...option } as any
    ) as any
})
```
3. 运行
```bash
# 克隆项目
git clone https://github.com/LaiBaoYuan/chatgpt-public.git
# 全局安装pnpm
npm i -g pnpm pm2
# 安装项目依赖
pnpm i
# 运行客户端
pnpm dev:client
# 运行服务端
pnpm dev:server
```

## Docker部署
> 前提要有**docker环境**

为了让大家能够省去环境配置的烦恼，本项目还支持`docker一键部署`的方式。
1. 修改`docker-compose.yaml`中`clash`服务的配置文件挂载目录,一般都在本地电脑的`.config`文件夹中

2. 修改`ecosystem.config.js`中`API_KEY`或`ACCESS_TOKEN`
3. 终端直接运行`docker-compose up -d`

## 服务器部署
> 服务器运行需要一个**域名**才可以进行正常访问，不然数据是写入不了**redis缓存**中的。
1. 修改`ecosystem.config.js`中`DOMAIN`，填写自己服务器的域名
```js
{
  name: 'server',
  interpreter: './node_modules/.bin/ts-node-esm',
  interpreter_args: '--experimentalSpecifierResolution=node',
  script: './packages/server/index.ts',
  env: {
    DOMAIN: '', // 生产环境域名
    REDIS_PASSWORD: '', // 生产环境redis密码，没有则填空字符串
    API_KEY: '' // 使用ChatGPTAPI构造函数才需要
    // ACCESS_TOKEN: '测试环境的chatgpt access_token' // 使用ChatGPTUnofficialProxyAPI构造函数才需要
  }
}
```
2. 修改`packages/client/.env.production的域名`
```bash
VITE_BASE_API="http://生产环境域名/backend-api"
```
3. 修改`docker-compose.yaml`中client-server服务的构建变量
```
client-server:
  build: 
    context: .
    args:
      - ENV=prod # 这里要切换构建生产环境
  ports:
    - 5173:5173 # 前端端口
    - 9000:9000 # 后端端口
  depends_on:
    - redis
    - clash
```
4. 服务器直接运行`docker-compose up -d`
5. `Nginx`反向代理配置如下
```
location /backend-api {
    proxy_set_header Cookie $http_cookie;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass http://localhost:9000/backend-api/;
}

location /backend-api/conversation {
    proxy_pass http://localhost:9000/backend-api/conversation;
    proxy_http_version 1.1;
    proxy_set_header Connection '';
    chunked_transfer_encoding off;
    proxy_buffering off;
    proxy_cache off;
    proxy_redirect off;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Cookie $http_cookie;
    proxy_read_timeout 86400s;
    proxy_send_timeout 86400s;
}

location / {
    proxy_pass http://localhost:5173;
}
```

## 最终效果

![](https://files.mdnice.com/user/36542/095040fb-49bd-4f90-a4eb-3e6e55deea63.png)

![](https://files.mdnice.com/user/36542/dba79f56-bad9-4e30-b87a-93aaea93bdfc.png)

![](https://files.mdnice.com/user/36542/0c97fd21-1ea1-4497-a3eb-597d7c25aae8.png)