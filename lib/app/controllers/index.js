'use strict'

const router = require('koa-router')(),
          fs = require('fs')


router.get(/\//, function* (){

  if (isProduction &&
    (SETTINGS.ip_white_list || []).length > 0 &&
    !_.find(SETTINGS.ip_white_list || [], (n) => new RegExp(n).test(this.ip))
  ){
    this.status = 401
    return
  }

  //for a new session id
  if (_.isEmpty(_.get(this.session, "id", ""))){
    this.session = {
      id: Math.random(),
      expired_at: moment().add(30, "days").toDate() * 1,
    }
  }

  yield this.render("vue", {
    layout: 'layout/vue',

    i18n: require(`${this.i18n.directory}/${this.i18n.getLocale()}${this.i18n.extension}`)
  })
})

module.exports = router
