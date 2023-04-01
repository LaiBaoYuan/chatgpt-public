module.exports = {
  apps: [
    {
      name: 'client',
      script: 'serve',
      exec_mode: 'cluster',
      cwd: './packages/client/',
      env: {
        PM2_SERVE_PATH: './dist',
        PM2_SERVE_PORT: 5173,
        PM2_SERVE_SPA: 'true'
      }
    },
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
  ]
}
