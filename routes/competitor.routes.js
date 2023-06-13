const Competitor=require('../app/controllers/competitors.controller')
const {auth,authToThisRoute}=require('../app/middlewares')
const router=require('express').Router()

router.post('/'/*,auth,authToThisRoute*/,Competitor.addCompetitor)
router.get('/:subscriptionId'/*,auth,authToThisRoute*/,Competitor.getThisSubscriptionCompetitors)
router.get('/allcompetition/:compId',auth,/*authToThisRoute,*/Competitor.getAllCompetitionCompetitors)
router.get('/:subscriptionId/:category'/*,auth,authToThisRoute*/,Competitor.getThisSubscriptionCompetitorsByCategory)
router.delete('/:competitorId'/*,auth,authToThisRoute*/,Competitor.removeCompetitor)
router.put('/:competitorId'/*,auth,authToThisRoute*/,Competitor.editCompetitor)
module.exports=router