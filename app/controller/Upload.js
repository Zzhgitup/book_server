const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { mkdirp } = require('mkdirp');
const { dir } = require('console');
const Controller = require('egg').Controller;
class UploadController extends Controller {
  //上传文件
  async upload() {
    const { ctx } = this;
    //
    let file = ctx.request.files[0];
    let uploadDir = '';
    try {
      let f = fs.readFileSync(file.filepath);
      //获取当前日期
      let day = moment(new Date()).format('YYYYMMDD');
      //创建图品保存路径
      let Dir = path.join(this.config.uploadDir, day);
      let date = Date.now();
      await mkdirp(Dir); //不存在就创建路径
      uploadDir = path.join(Dir, date + path.extname(file.filename));
      //写入文件夹
      fs.writeFileSync(uploadDir, f);
    } catch (error) {
      console.log(error);
      return null;
    } finally {
      ctx.cleanupRequestFiles(); //清除临时文件
    }
    ctx.body = {
      code: 200,
      msg: '上传成功',
      date: uploadDir.replace(/app/g, '')
    };
  }
}
module.exports = UploadController;
