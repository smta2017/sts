const Competition=require('../app/controllers/competition.controller')
const {auth,authToThisRoute}=require('../app/middlewares')
const router=require('express').Router()
router.post('/',/*auth,authToThisRoute,*/Competition.add)
router.put('/:id',/*auth,authToThisRoute,*/Competition.update)
// router.get('/',/*auth,authToThisRoute,*/Competition.add)
router.delete('/:id',/*auth,authToThisRoute,*/Competition.delete)
router.get('/all',/*auth,authToThisRoute,*/Competition.getAll)
router.get('/forrefree',/*auth,authToThisRoute,*/Competition.getEnableRefreeComp)
router.get('/opentoregisteration',auth,/*authToThisRoute,*/Competition.getOpenToRegister)
module.exports=router