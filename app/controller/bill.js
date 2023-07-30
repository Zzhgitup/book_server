const moment = require('moment');
const Controller = require('egg').Controller;
/**
 * @cotroller 账单接口
 */
class billController extends Controller {
  //添加账单
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
  //获取账单列表
  async list() {
    const { ctx, app } = this;
    const { date, page, page_size = 5, type_id = 'all' } = ctx.query;
    try {
      let user_id;
      // 通过 token 解析，拿到 user_id
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      user_id = decode.id;
      const list = await ctx.service.bill.list(user_id);
      // 过滤出月份
      const _list = list.filter((item) => {
        if (type_id != 'all') {
          return moment(Number(item.date)).format('YYYY-MM') == date && type_id == item.type_id;
        }
        return moment(Number(item.date)).format('YYYY-MM') == date;
      });

      // 格式化
      let listMap = _list
        .reduce((curr, item) => {
          const date = moment(Number(item.date)).format('YYYY-MM-DD');
          // 如果能在累加的数组中找到当前项日期的，那么在数组中的加入当前项到 bills 数组。
          if (curr && curr.length && curr.findIndex((item) => item.date == date) > -1) {
            const index = curr.findIndex((item) => item.date == date);
            curr[index].bills.push(item);
          }
          // 如果在累加的数组中找不到当前项日期的，那么再新建一项。
          if (curr && curr.length && curr.findIndex((item) => item.date == date) == -1) {
            curr.push({
              date,
              bills: [item]
            });
          }

          if (!curr.length) {
            curr.push({
              date,
              bills: [item]
            });
          }
          return curr;
        }, [])
        .sort((a, b) => moment(b.date) - moment(a.date));

      // 分页处理
      const filterListMap = listMap.slice((page - 1) * page_size, page * page_size);

      let __list = list.filter((item) => moment(Number(item.date)).format('YYYY-MM') == date);
      let totalExpense = __list.reduce((curr, item) => {
        if (item.pay_type == 1) {
          curr += Number(item.amount);
          return curr;
        }
        return curr;
      }, 0);
      let totalIncome = __list.reduce((curr, item) => {
        if (item.pay_type == 2) {
          curr += Number(item.amount);
          return curr;
        }
        return curr;
      }, 0);

      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          totalExpense,
          totalIncome,
          totalPage: Math.ceil(listMap.length / page_size),
          list: filterListMap || []
        }
      };
    } catch {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null
      };
    }
  }
  //获取账单详情
  async getbilldetail() {
    const { ctx, app } = this;
    const { id = '' } = ctx.query;
    let user_id = app.userinfo.id;
    if (!id) {
      ctx.body = {
        code: 500,
        msg: '账单ID不能为空',
        data: null
      };
    }
    try {
      const result = await ctx.service.bill.getbilldetail(id, user_id);
      ctx.body = {
        code: 200,
        data: result,
        msg: '查询成功'
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: '系统异常',
        data: null
      };
    }
  }
  //修改账单
  async editBill() {
    const { ctx } = this;
    const { id, amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body;
    let user_id = ctx.app.userinfo.id;
    try {
      const result = await ctx.service.bill.editBill({
        user_id,
        id, //账单ID
        amount, //账单金额
        type_id, //消费类型ID
        type_name, //消费类型名称
        date, //消费时间
        pay_type, //消费类型
        remark //备注
      });
      ctx.body = {
        code: 200,
        msg: '修改成功',
        date: null
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: error
      };
    }
  }
  //删除账单
  async deletebill() {
    const { app, ctx } = this;
    const { id } = ctx.query;
    if (!id) {
      ctx.body = {
        code: 500,
        msg: '缺少ID'
      };
      return;
    }
    try {
      const result = await ctx.service.bill.deletebill(id, app.userinfo.id);
      ctx.body = {
        code: 200,
        msg: '删除成功',
        data: null
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '删除失败',
        data: null
      };
    }
  }
  //查询数据表数据
  async data() {
    const { ctx } = this;
    const { date = '' } = ctx.query;
    if (!date) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        msg: '错误参数',
        data: null
      };
    }
    try {
      const result = ctx.service.bill.Billdata(date); //接收到的就是当月数据
      const total_expense = result.reduce((curr, item) => {
        //总支出
        if (item.type_id == 1) {
          curr += Number(item.amount);
        }
        return curr;
      }, 0);
      const totalIncome = result.reduce((curr, item) => {
        //总收入
        if (item.type_id == 2) {
          curr += item.amount;
        }
        return curr;
      }, 0);
      //收支构成
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '获取失败',
        data: null
      };
    }
  }
}
module.exports = billController;
