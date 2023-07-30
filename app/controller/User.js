'use strict';
const { Controller } = require('egg');
const defaultavte =
  'https://p3-passport.byteimg.com/img/user-avatar/6971cbaa33a2f797512b9bfb86732e02~100x100.awebp';
/**
 * @controller 用户管理
 */
class UserController extends Controller {
  token = this.ctx.request.header.authorization;
  secret = this.app.config.jwt.secret;
  //注册
  async register() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    // 判空操作
    if (!username || !password) {
      ctx.body = {
        code: 500,
        msg: '账号密码不能为空',
        data: null
      };
      return;
    }
    //验证数据库是否已经有这个用户
    try {
      const userinfo = await ctx.service.user.getUserByName(username);
      if (userinfo && userinfo.id) {
        ctx.body = {
          code: 500,
          msg: '已经注册过了'
        };
      } else {
        await ctx.service.user.register({
          username,
          password,
          ctime: Date.parse(new Date()), //储存时间戳
          signature: '世界和平',
          avater: defaultavte
        });
        ctx.body = {
          code: 200,
          msg: '注册成功'
        };
      }
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: '注册失败'
      };
    }
  }
  //登录
  async login() {
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;
    if (!username || !password) {
      ctx.body = {
        code: 500,
        msg: '信息不完整'
      };
      return;
    }
    //信息完整 接下来，看看是否存在该用户
    try {
      const result = await ctx.service.user.getUserByName(username);
      if (!result || !result.id) {
        ctx.body = {
          code: 500,
          msg: '不存在该用户'
        };
        return;
      }
      //判断密码是否正确
      if (result.password != password) {
        ctx.body = {
          code: 500,
          msg: '密码错误'
        };
        return;
      }
      const token = app.jwt.sign(
        {
          id: result.id,
          username: result.username,
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 // token 有效期为 24 小时
        },
        app.config.jwt.secret
      );
      ctx.body = {
        code: 200,
        msg: '登录成功',
        date: { token }
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: '登陆失败'
      };
    }
  }
  /* 解析jwt */
  async parsejwt() {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    ctx.body = {
      code: 200,
      msg: '解析成功',
      data: decode
    };
  }
  //获取用户信息
  async getuserinfo() {
    const { ctx, app } = this;
    //获取用户信息
    /*  const token = ctx.request.header.authorization; */
    const decode = await app.jwt.verify(this.token, this.secret);
    const result = await ctx.service.user.getUserByName(decode.username);
    ctx.body = {
      code: 200,
      msg: '请求成功',
      data: {
        username: result.username,
        id: result.id,
        signature: result.signature,
        avater: result.avater
      }
    };
  }
  //修改用户信息
  async editUserInfo() {
    const { ctx, app } = this;
    const { signature = '', avater = '' } = ctx.request.body;
    try {
      //解析token
      const decode = await app.jwt.verify(this.token, this.secret);
      if (!decode) {
        return;
      }
      //从数据库获取用户信息
      const userinfo = await ctx.service.user.getUserByName(decode.username);
      //调用Service层的方法
      const result = await ctx.service.user.editUserInfo({
        signature,
        avater,
        ...userinfo
      });
      ctx.body = {
        code: 200,
        msg: '修改成功',
        data: {
          id: userinfo.id,
          signature,
          avater,
          username: userinfo.username
        }
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '修改失败'
      };
    }
  }
  //手写JSONp
  async JSONPtext() {
    const { ctx } = this;
    const callbackname = ctx.query.callback;
    const date = {
      a: 1,
      b: 2
    };
    const jsonDate = JSON.stringify(date);
    const jscode = `${callbackname}(${jsonDate})`;
    ctx.set('Content-type', 'text/javascript');
    ctx.body = jscode;
    try {
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: '系统错误'
      };
    }
  }
}

module.exports = UserController;
