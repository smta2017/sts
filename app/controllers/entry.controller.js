const { uploadfile } = require('../middlewares')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const entryModel = require('../../db/models/entry.model')
const Helper = require('../helper')
const subscriptionModel = require('../../db/models/subscription.model')
const competitionModel = require('../../db/models/competition.model')
const countryModel = require('../../db/models/country.model')
class Entry {
    static addEntry = async(req, res) => {
        try {
            let music
            let otherCountry
            if (req.user.role.toString() == process.env.academy) {
                await req.user.populate('academyDetails')
                otherCountry=(req.user.academyDetails.country.toString()==process.env.otherCountry)
            }else{
                otherCountry=req.header('otherCountry')=='false'?false:true
            }
            const upload = uploadfile(otherCountry?'entries_vedios':'entries_music', otherCountry?['video/webm','video/mpeg','video/mp4']:['audio/mpeg', 'audio/webm'])
            const uploadImage = upload.single('music')
            uploadImage(req, res, async function (e) {
                if (e instanceof multer.MulterError)
                    Helper.formatMyAPIRes(res, 500, false, e, e.message + 'its a multer error')
                else if (e) {
                    Helper.formatMyAPIRes(res, 500, false, e, e.message)
                }
                else {
                    try {
                        const sub=await Helper.isThisIdExistInThisModel(req.body.qualifierSubscription, ['competition','paid'], subscriptionModel, 'subscription', 'competition')
                        const competitionType = sub.competition.type
                        if (competitionType == 'final') {
                            if (req.user.role.toString() == process.env.academy) {
                                const e = new Error('you can not add new entry that did not take apart in the qualifier')
                                e.name = 'Error'
                                throw e
                            } else {
                                req.body.finalSubscription = req.body.qualifierSubscription
                            }
                        }
                        if((sub.paid||sub.competition.stopSubscription)&&req.user.role.toString() == process.env.academy){
                            const e = new Error('you can not add new entry now,contact us for any help')
                            e.name = 'Error'
                            throw e
                        }
                        await req.user.isThisSubscriptionBelongToMe(req.body.qualifierSubscription)
                        if (req.file) {
                            music = req.file.path.replace('statics\\', '')
                            music = music.replace(/\\/g, '/')
                            // req.body.competitors=['6484cc422176b3a2fc16a1eb','6485a4c3c081a4fa0250eba7']
                            req.body.music = music
                        }
                        for (let field in req.body) {
                            if (!['name', 'music', 'style','qualifierSubscription'].includes(field) ) { delete req.body[field] }
                        }
                        const entry = await entryModel.create(req.body)
                        Helper.formatMyAPIRes(res, 200, true, { file: req.file ? req.file : 'no file uploaded', entry }, `well done you addd new entry perpare for it and don't forget to pay it's fees`)
                    }
                    catch (e) {
                        console.log(e)
                        if (fs.existsSync(path.join(__dirname, '../../statics/' + music))) {
                            fs.unlinkSync(path.join(__dirname, '../../statics/' + music))
                        }
                        if (e.name == 'Error') {
                            Helper.formatMyAPIRes(res, 200, false, e, e.message)
                        } else if (e.name == 'MongoServerError' || e.name == 'ValidationError' || e.name == 'CastError') {
                            Helper.formatMyAPIRes(res, 400, false, e, e.message)
                        } else {
                            Helper.formatMyAPIRes(res, 500, false, e, e.message)
                        }
                    }
                }
            })
        } catch (e) {
            if (e.name == 'Error') {
                Helper.formatMyAPIRes(res, 200, false, e, e.message)
            } else if (e.name == 'MongoServerError' || e.name == 'ValidationError' || e.name == 'CastError') {
                Helper.formatMyAPIRes(res, 400, false, e, e.message)
            } else {
                Helper.formatMyAPIRes(res, 500, false, e, e.message)
            }
        }
    }
    static addCompetitorToEntry = (req, res) => {
        Helper.handlingMyFunction(req, res, async (req) => {
            const entry = await Helper.isThisIdExistInThisModel(req.params.entryId, ['competitors', 'qualifierSubscription', 'competitorsCategories', 'finalSubscription'], entryModel, 'entry', { path: 'finalSubscription', populate: 'competition' },{ path: 'qualifierSubscription', populate: 'competition' })
            if (((entry.finalSubscription && entry.finalSubscription.competition.type == 'final' )||entry.qualifierSubscription.paid||entry.qualifierSubscription.competition.stopSubscription)&& req.user.role.toString() == process.env.academy) {
                const e = new Error('you can not edit in the competitor list of this entry ,please contect us for any questions')
                e.name = 'Error'
                throw e
            }
            await req.user.isThisSubscriptionBelongToMe(entry.qualifierSubscription._id)
            entry.competitors.push(req.params.competitorId)
            if (true) {
                return entry.save()
            }
        }, 'you added competitor successfully')
    }
    static removeCompetitorFromEntry = (req, res) => {
        Helper.handlingMyFunction(req, res, async (req) => {
            const entry = await Helper.isThisIdExistInThisModel(req.params.entryId, ['competitors', 'qualifierSubscription', 'competitorsCategories', 'finalSubscription'], entryModel, 'entry', { path: 'finalSubscription', populate: 'competition' },{ path: 'qualifierSubscription', populate: 'competition' })
            if (((entry.finalSubscription && entry.finalSubscription.competition.type == 'final' )||entry.qualifierSubscription.paid||entry.qualifierSubscription.competition.stopSubscription)&& req.user.role.toString() == process.env.academy) {
                const e = new Error('you can not delete any competitior from this show now ,please contact us for any questions')
                e.name = 'Error'
                throw e
            }
            await req.user.isThisSubscriptionBelongToMe(entry.qualifierSubscription)
            const i = entry.competitors.findIndex(competitor => competitor._id.toString() == req.params.competitorId)
            if (i == -1) {
                const e = new Error('this competitor is not in this entry already')
                e.name = 'Error'
                throw e
            }
            entry.competitors.splice(i, 1)
            if (true) {
                return entry.save()
            }
        }, 'you delted competitor successfully')
    }
    static allentries = (req, res) => {
        Helper.handlingMyFunction(req, res, async (req) => {
            await req.user.isThisSubscriptionBelongToMe(req.params.subscriptionId)
            const subscription = await Helper.isThisIdExistInThisModel(req.params.subscriptionId, ['competition'], subscriptionModel, 'subscription', {path:'competition',populate:'country'})
            const filter = {}
            let projection = ['name', 'music', 'competitors', 'category','classCode','style','passedQualifiers']
            filter[subscription.competition.type + 'Subscription'] = req.params.subscriptionId
            if (subscription.competition.type == 'final') {
                filter.passedQualifiers = true
            }
            if (req.baseUrl + (req.route.path == '/' ? '' : req.route.path) == '/sts/entry/schedual/:subscriptionId') {
                projection = [subscription.competition.type + 'ShowDate', 'name']
                filter[subscription.competition.type + 'ShowDate'] = { $nin: [null, ''] }
            } else if (req.baseUrl + (req.route.path == '/' ? '' : req.route.path) == '/sts/entry/mystatment/:subscriptionId') {
               console.log(subscription.competition.type)
                projection = [subscription.competition.type + 'TotalFees', 'name']
                if (subscription.competition.type == 'final') {
                    const country = await Helper.isThisIdExistInThisModel(process.env.FinalCompetitionPaymentDataID, null, countryModel, 'country')
                    res.header("currency",country.currency)
                }else{
                    res.header("currency",subscription.competition.country.currency)
                }
            } else if (req.baseUrl + (req.route.path == '/' ? '' : req.route.path) == '/sts/entry/myresult/:subscriptionId') {
                projection = [subscription.competition.type + 'TotalDegree', 'passedQualifiers', 'name','classCode','style']
                filter[subscription.competition.type + 'Refree1'] = { $exists: true }
                filter[subscription.competition.type + 'Refree2'] = { $exists: true }
                filter[subscription.competition.type + 'Refree3'] = { $exists: true }
                filter[subscription.competition.type + 'Last10Present'] = { $exists: true }
            } else if (req.baseUrl + (req.route.path == '/' ? '' : req.route.path) == '/sts/entry/:subscriptionId') {
                delete filter.passedQualifiers
            }
            if (!projection || projection.includes('competitors')) {
                return entryModel.find(filter, projection)/*.populate({ path: subscription.competition.type + 'Subscription',select:['academy'], populate: { path: 'academy',select:['academyDetails'], populate: 'academyDetails' } })*/.populate({ path: 'competitors', select: ['firstName', 'lastName', 'category'] })
            } else {
                return entryModel.find(filter, projection)/*.populate({ path: subscription.competition.type + 'Subscription',select:['academy'], populate: { path: 'academy',select:['academyDetails'], populate: 'academyDetails' } })*/
            }

        }, 'there is all your recorded entries for this competition')
    }
    static allentriesByCategory = (req, res) => {
        Helper.handlingMyFunction(req, res, async (req) => {
            await req.user.isThisSubscriptionBelongToMe(req.params.subscriptionId)
            const subscription = await Helper.isThisIdExistInThisModel(req.params.subscriptionId, ['competition'], subscriptionModel, 'subscription', 'competition')
            const filter = {}
            filter[subscription.competition.type + 'Subscription'] = req.params.subscriptionId
            filter.competitorsCategories = req.params.category
            if (true) { return entryModel.find(filter, ['name', 'music', 'competitors', 'category','classCode','style','passedQualifiers']).populate({ path: 'competitors', select: ['firstName', 'lastName', 'category'] }) }
        }, 'there is all your recorded entries for this competition')
    }
    static delete = (req, res) => {
        Helper.handlingMyFunction(req, res, async (req) => {
            const entry = await Helper.isThisIdExistInThisModel(req.params.entryId, null, entryModel, 'entry', { path: 'finalSubscription', populate: 'competition' },{ path: 'qualifierSubscription', populate: 'competition' })
            if (((entry.finalSubscription && entry.finalSubscription.competition.type == 'final' )||entry.qualifierSubscription.paid||entry.qualifierSubscription.competition.stopSubscription)&& req.user.role.toString() == process.env.academy) {
                const e = new Error('you can not delete this entry right now ,please contact us for any questions')
                e.name = 'Error'
                throw e
            }
            await req.user.isThisSubscriptionBelongToMe(entry.qualifierSubscription._id)
            const result = await entryModel.findByIdAndDelete(req.params.entryId)
            if (!result) {
                const e = new Error('there is no such a news')
                e.name = 'CastError'
                throw e
            }
            if (fs.existsSync(path.join(__dirname, '../../statics/' + result.music))) {
                fs.unlinkSync(path.join(__dirname, '../../statics/' + result.music))
            }
            if (true) {
                return result
            }
        }, "you deleted entry  successfully")
    }
    static edit = async(req, res) => {
        try {
            let music
            let otherCountry
            if (req.user.role.toString() == process.env.academy) {
                await req.user.populate('academyDetails')
                otherCountry=(req.user.academyDetails.country.toString()==process.env.otherCountry)
            }else{
                otherCountry=req.header('otherCountry')=='false'?false:true
            }
            const upload = uploadfile(otherCountry?'entries_vedios':'entries_music', otherCountry?['video/webm','video/mpeg','video/mp4']:['audio/mpeg', 'audio/webm'])
            const uploadImage = upload.single('music')
            uploadImage(req, res, async function (e) {
                if (e instanceof multer.MulterError)
                    Helper.formatMyAPIRes(res, 500, false, e, e.message + 'its a multer error')
                else if (e) {
                    Helper.formatMyAPIRes(res, 500, false, e, e.message)
                }
                else {
                    try {
                        let oldMusic
                        const entry = await Helper.isThisIdExistInThisModel(req.params.entryId, null, entryModel, 'entry', { path: 'finalSubscription', populate: 'competition' },{ path: 'qualifierSubscription', populate: 'competition' })
                        if (((entry.finalSubscription && entry.finalSubscription.competition.type == 'final' )||entry.qualifierSubscription.paid||entry.qualifierSubscription.competition.stopSubscription)&& req.user.role.toString() == process.env.academy) {
                            const e = new Error('you can not edit in the entry data now ,please contact us for any questions')
                            e.name = 'Error'
                            throw e
                        }
                        await req.user.isThisSubscriptionBelongToMe(entry.qualifierSubscription._id)
                        if (req.file) {
                            music = req.file.path.replace('statics\\', '')
                            music = music.replace(/\\/g, '/')
                            req.body.music = music
                            oldMusic = entry.music
                        }
                        for (let field in req.body) {
                            if (!['_id', 'qualifierSubscription', 'qualifierTotalFees', 'finalTotalFees', 'finalSubscription', 'category', 'passedQualifiers', 'competitorsCategories','classCode'].includes(field) && req.body[field]) { entry[field] = req.body[field] }
                        }
                        const result = await entry.save()
                        if (fs.existsSync(path.join(__dirname, '../../statics/' + oldMusic)) && req.file) {
                            fs.unlinkSync(path.join(__dirname, '../../statics/' + oldMusic))
                        }
                        Helper.formatMyAPIRes(res, 200, true, { file: req.file, result }, 'congrats,you update news data successfully')
                    }
                    catch (e) {
                        console.log(e)
                        if (fs.existsSync(path.join(__dirname, '../../statics/' + music))) {
                            fs.unlinkSync(path.join(__dirname, '../../statics/' + music))
                        }
                        Helper.formatMyAPIRes(res, 500, false, e, e.message)
                    }
                }
            })
        } catch (e) {
            console.log(e)
            Helper.formatMyAPIRes(res, 500, false, e, e.message)
        }
    }
    static getAllCompetitionEntries = (req, res) => {
        Helper.handlingMyFunction(req, res, async (req) => {
            let  allCompetitonSubscripetition
            if(req.baseUrl + (req.route.path == '/' ? '' : req.route.path) == '/sts/entry/completeresult/:compId'&&[process.env.refree1, process.env.refree2, process.env.refree3].includes(req.user.role.toString())){
                allCompetitonSubscripetition = await subscriptionModel.find({ competition: req.params.compId , paid :true}, ['_id', 'competiton']).populate('competition')
            }{
                allCompetitonSubscripetition = await subscriptionModel.find({ competition: req.params.compId }, ['_id', 'competiton']).populate('competition')
            }
            if (allCompetitonSubscripetition.length <= 0) {
                const e = new Error('there is no acaedmy joins this competition')
                e.name = 'Error'
                throw e
            }
            const subscriptionArray = allCompetitonSubscripetition.map(sub => sub._id)
            const filter = {}
            filter[allCompetitonSubscripetition[0].competition.type + 'Subscription'] = { $in: subscriptionArray }
            if (allCompetitonSubscripetition[0].competition.type == 'final') {
                filter.passedQualifiers = true
            }
            let projection //= [allCompetitonSubscripetition[0].competition.type + 'Subscription','competitors','name','music','passedQualifiers','category']
            if (req.baseUrl + (req.route.path == '/' ? '' : req.route.path) == '/sts/entry/completeschedule/:compId') {
                projection = [allCompetitonSubscripetition[0].competition.type + 'ShowDate', allCompetitonSubscripetition[0].competition.type + 'Subscription', 'name']
                if (req.user.role.toString() == process.env.academy/*academy role id */) { filter[allCompetitonSubscripetition[0].competition.type + 'ShowDate'] = { $nin: [null, ""] } }
            } else if (req.baseUrl + (req.route.path == '/' ? '' : req.route.path) == '/sts/entry/completeresult/:compId') {
                if ([process.env.refree1, process.env.refree2, process.env.refree3].includes(req.user.role.toString())) { /*refree roles ids */
                    await req.user.populate('role')
                    projection = [allCompetitonSubscripetition[0].competition.type + req.user.role.role, allCompetitonSubscripetition[0].competition.type + 'Subscription', 'name','classCode','category','style']
                    filter[allCompetitonSubscripetition[0].competition.type + req.user.role.role] = { $exists: false }
                } else {
                    projection = [allCompetitonSubscripetition[0].competition.type + 'TotalDegree', allCompetitonSubscripetition[0].competition.type + 'Subscription', 'passedQualifiers', 'name','classCode','category','style']
                    filter[allCompetitonSubscripetition[0].competition.type + 'Refree1'] = { $exists: true }
                    filter[allCompetitonSubscripetition[0].competition.type + 'Refree2'] = { $exists: true }
                    filter[allCompetitonSubscripetition[0].competition.type + 'Refree3'] = { $exists: true }
                    filter[allCompetitonSubscripetition[0].competition.type + 'Last10Present'] = { $exists: true }
                }
            }
            if (!projection || projection.includes('competitors')) {
                return entryModel.find(filter, projection).populate({ path: allCompetitonSubscripetition[0].competition.type + 'Subscription', select: ['academy'], populate: { path: 'academy', select: ['academyDetails'], populate: { path: 'academyDetails', select: ['schoolName'] } } }).populate({ path: 'competitors', select: ['firstName', 'lastName', 'category'] })
            } else {
                return entryModel.find(filter, projection).populate({ path: allCompetitonSubscripetition[0].competition.type + 'Subscription', select: ['academy'], populate: { path: 'academy', select: ['academyDetails'], populate: { path: 'academyDetails', select: ['schoolName'] } } })
            }
        }, 'there are all this competition entries')
    }
    static addAdminData = (req, res) => {
        Helper.handlingMyFunction(req, res, async (req) => {
            await req.user.populate('role')
            const type = (await Helper.isThisIdExistInThisModel(req.params.subscriptionId, ['competition'], subscriptionModel, 'subscription', { path: 'competition' })).competition.type
            const entry = await Helper.isThisIdExistInThisModel(req.params.entryId, null, entryModel, 'entry')
            if (type == 'final' && !entry.passedQualifiers) {
                const e = new Error('this entry is not qulified for this competition')
                e.name = 'CastError'
                throw e
            }
            if ([process.env.refree1, process.env.refree2, process.env.refree3].includes(req.user.role._id.toString())) {/*refree roles ids */
                if (!req.body.degree) {
                    const e = new Error('we did not recieve any degree to record')
                    e.name = 'CastError'
                    throw e
                }
                entry[type + req.user.role.role] = req.body.degree
            } else {
                for (let field in req.body) {
                    if (!['_id', 'qualifierSubscription', 'qualifierlTotalFees', 'finalTotalFees', 'finalSubscription', 'category', 'passedQualifiers', 'competitorsCategories'].includes(field) && req.body[field]) { entry[type + field] = req.body[field] }
                }
            }

            if (true) { return entry.save() }
        }, 'your data added successfully')
    }
    static getFullStatments = (req, res) => {
        Helper.handlingMyFunction(req, res, async (req) => {
            const type = (await Helper.isThisIdExistInThisModel(req.params.subscriptionId, ['competition'], subscriptionModel, 'subscription', 'competition')).competition.type
            const filter = {}
            filter[type + 'Subscription'] = req.params.subscriptionId
            if (type == 'final') {
                filter.passedQualifiers = true
            }
            const entries = await entryModel.find(filter, ['name', type + 'Subscription', 'category']).populate({ path: 'competitors', select: ['firstName', 'lastName', 'category'] }).populate({ path: type + 'Subscription', select: ['academy'], populate: { path: 'academy', select: ['academyDetails'], populate: { path: 'academyDetails', select: ['schoolName'] } } })
            const country = await Helper.isThisIdExistInThisModel(process.env.FinalCompetitionPaymentDataID, null, countryModel, 'country')
            const fullStatment = []
            await req.user.populate({ path: 'academyDetails', populate: { path: 'country' } })

            entries.forEach(entry => {
                entry.competitors.forEach(competitorDoc => {
                    const competitor = competitorDoc.toObject()
                    competitor.entryName = entry.name
                    const calCat = (entry.category == 'solo'||entry.category=='duoOrTrio' )? entry.category : 'group'
                    if (type != 'final') {
                        competitor.entryFees = req.user.academyDetails.country[calCat + competitor.category + 'Fees'] +' '+ req.user.academyDetails.country.currency
                    } else {
                        competitor.entryFees = country[calCat + competitor.category + 'Fees'] +' '+ country.currency
                    }
                    fullStatment.push(competitor)
                })
            })
            if (true) { return fullStatment }
        }, 'there is all your recorded entries for this competition')
    }
}
module.exports = Entry