'use strict';
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller, middleware } = app;
  const _jwt = middleware.jwtErr(app.config.jwt.secret);
  router.post('/api/user/register', controller.user.register);
  router.post('/api/user/login', controller.user.login);
  router.get('/gettoken', _jwt, controller.user.parsejwt);
  router.get('/api/getuserinfo', _jwt, controller.user.getuserinfo);
  router.put('/api/user/edituser', _jwt, controller.user.editUserInfo);
  router.post('/api/user/upload', _jwt, controller.upload.upload);
  router.post('/api/bill/add', _jwt, controller.bill.add);
  router.get('/api/bill/list', _jwt, controller.bill.list);
};
