/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1688799869376_7444';

  // add your middleware config here
  config.middleware = [];
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
    },
    domainWhiteList: ['*']
  };
  config.mysql = {
    client: {
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: 'zhaozihao',
      database: 'tally_book'
    },
    app: true,
    agent: false
  };
  config.view = {
    mapping: { '.html': 'ejs' }
  };
  config.jwt = {
    secret: 'zihao'
  };
  config.cluster = {
    listen: {
      path: '',
      port: 7002,
      hostname: '127.0.0.1'
    }
  };
  config.multipart = {
    mode: 'file'
  };
  config.cors = {
    origin: '*',
    credentials: true,
    allowMethods: 'GET,PUT,POST,DELETE,HEAD'
  };
  // add your user config here
  const userConfig = {
    uploadDir: 'app/public/upload'
    // myAppName: 'egg',
  };
  return {
    ...config,
    ...userConfig
  };
};
