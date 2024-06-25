const Router = require("koa-router");
const router = new Router();

const fs = require("fs");
const path = require("path");

const homePage = fs.readFileSync(path.join(__dirname, "index.html"), "utf-8");

const { Counter } = require("./db");

const { addPerson, getAllPersons } = require('./db-person')


module.exports = (app) => {
// 首页
router.get("/", async (ctx) => {
  ctx.body = homePage;
});
// 更新计数
router.post("/api/count", async (ctx) => {

  console.log('[/api/count] - post -> ctx: \n', ctx)

  const { request } = ctx;
  const { action } = request.body;
  if (action === "inc") {
    await Counter.create();
  } else if (action === "clear") {
    await Counter.destroy({
      truncate: true,
    });
  }

  ctx.body = {
    code: 0,
    data: await Counter.count(),
  };
});

// 获取计数
router.get("/api/count", async (ctx) => {
  const result = await Counter.count();

  ctx.body = {
    code: 0,
    data: result,
  };
});

// 小程序调用，获取微信 Open ID
router.get("/api/wx_openid", async (ctx) => {
  if (ctx.request.headers["x-wx-source"]) {
    ctx.body = ctx.request.headers["x-wx-openid"];
  }
});


// 新增人员
router.post("/api/addPeron", async (ctx) => {
  
  const { request } = ctx;
  const tmpBosy = request.body;
  console.log('[/api/addPeron] - post -> tmpBosy: \n', tmpBosy)

  const result = await addPerson(tmpBosy);
  ctx.body = {
    code: 200,
    data: (result.dataValues.uuid) ? {msg: '成功'} : {msg: '失败'},
  };
});

// 查询人员列表
router.post("/api/searchPeronList", async (ctx) => {
  const { request } = ctx;
  const tmpBosy = request.body;
  const list = await getAllPersons( tmpBosy )
  ctx.body = {
    code: 200,
    data: list
  }
})

app.use(router.routes())
.use(router.allowedMethods());
}