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
  async list() {
    const { app } = this;
    const QUERY_STR = 'id,pay_type,amount,date,type_id,type_name,remark';
    let sql = `select ${QUERY_STR}  from bill where user_id = ${app.userinfo.id}`;
    try {
      const result = app.mysql.query(sql);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
module.exports = billService;
