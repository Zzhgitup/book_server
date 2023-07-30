const Controller = require('egg').Controller;

class Type extends Controller {
  async getlist() {
    const { ctx } = this;
    try {
      const res = await ctx.service.bill.gettypelist();
      ctx.body = {
        code: 200,
        data: res
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        mag: '系统错误'
      };
    }
  }
}
module.exports = Type;
