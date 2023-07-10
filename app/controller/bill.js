const moment = require('moment');
const Controller = require('egg').Controller;
class billController extends Controller {
  async add() {
    const { ctx } = this;
    const { amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body;
    if (!amount || !type_id || !type_name || !date || !pay_type) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        date: null
      };
      return;
    }
    try {
      const result = await ctx.service.bill.add({
        amount,
        type_id,
        type_name,
        date,
        pay_type,
        remark
      });
      ctx.body = {
        code: 200,
        msg: '添加成功',
        date: null
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: '系统错误',
        date: null
      };
    }
  }
  async list() {
    const { ctx } = this;
    const { date, page = 1, page_size = 5, type_id = 'all' } = ctx.query;
    try {
      let id = ctx.app.userinfo.id;
      //从数据库查询账单列表
      const result = await ctx.service.bill.list();
      //处理类型,过滤出日期和类型对应的数据
      const _list = result.filters((item) => {
        if (type_id != 'all') {
          return moment(item.date).format('YYYY-MM') == date && type_id == item.type_id;
        }
        return moment(item.date).format('YYYY-MM') == date;
      });
      //格式化数据
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: '系统错误',
        date: null
      };
    }
  }
}
module.exports = billController;
