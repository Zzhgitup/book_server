const Service = require('egg').Service;
class billService extends Service {
  async add(params) {
    const { app } = this;
    try {
      const result = app.mysql.insert('bill', {
        user_id: app.userinfo.id,
        ...params
      });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  //获取账单
  async list(id) {
    const { app } = this;
    const QUERY_STR = 'id,pay_type,amount,date,type_id,type_name,remark';
    let sql = `select ${QUERY_STR}  from bill where user_id = ${id} ORDER BY date DESC`;
    try {
      const result = app.mysql.query(sql);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  //获取账单信息
  async getbilldetail(id, user_id) {
    const { app } = this;
    try {
      const result = app.mysql.get('bill', { id, user_id });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  //修改账单信息
  async editBill(params) {
    const { app } = this;
    try {
      const result = app.mysql.update(
        'bill',
        { ...params },
        {
          id: params.id,
          user_id: params.user_id
        }
      );
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  //删除账单
  async deletebill(id, user_id) {
    const { app } = this;
    try {
      const result = app.mysql.delete('bill', { id: id, user_id: user_id });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  //查询账单图表数据
  async Billdata(date) {
    const { app } = this;
    try {
      //查出此用户的所有账单
      const result = await app.mysql.get('bill', { user_id: app.userinfo.id });
      const start = moment(date).startOf('month').unix() * 1000; // 选择月份，月初时间
      const end = moment(date).endOf('month').unix() * 1000; // 选择月份，月末时间
      const _date = result.filter((item) => {
        return parseInt(item.date) <= end && parseInt(item.date) >= start;
      });
      return _date;
    } catch (error) {
      console.log(error);
      return bull;
    }
  }
  //获取账单所有类型
  async gettypelist() {
    const { app } = this;
    try {
      const result = await app.mysql.query(`select * from type order by id ASC`);
      return result;
    } catch (error) {
      return null;
    }
  }
}
module.exports = billService;
