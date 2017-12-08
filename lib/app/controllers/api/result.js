'use strict'

const router = require('koa-router')(),
         raw = require('raw-body'),
        zlib = require('zlib')


router.post("/", function* (next){
  if (!this.is("gzip/json")){
    return yield next
  }

  _.chain(yield raw(this.req, {
    length: this.req.headers['content-length'],
  })).tap((buffer) => {
    _.merge(this.params, JSON.parse(zlib.gunzipSync(buffer).toString()))
  }).value()

  return yield next
}, function* (){

  const t = yield sequelize.transaction()

  const trigger = bluebird.mapSeries(_.get(this.params, "result", []), async (n) => {
    const task = await Task.findById(n.id, {lock: t.LOCK.UPDATE, transaction: t})
    const s = await task.getScript({transaction: t})

    if (n.message){
      return await task.fail()
    }

    if (n.result){
      await task.saveResult(n.result)
    }

    await bluebird.mapSeries(n.tasks || [], async ({ url, context, scriptName }) => {
      const p = await task.getProject({transaction: t})

      return await Task.create({
        url,
        context,
        scriptId: s.id,
        projectId: p.id,
      }, { transaction: t })
    })

    await task.succee({transaction: t})
  })

  try{
    yield trigger

    yield t.commit()

    this.body = {
      status: 0
    }
  }catch(e){
    logger.error(e)

    yield t.rollback()

    this.body = {
      status: 500,
      message: 'save result failed.'
    }
  }
})

router.post("/:scriptId", function* (){
})

module.exports = router