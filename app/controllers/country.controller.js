const countryModel = require('../../db/models/country.model')
const Helper = require('../helper')
class Country {
    static add = (req, res) => {
        Helper.handlingMyFunction(req, res, (req) => {
            return countryModel.create(req.body)
        }, 'congrats,you added new available country to be able to make the competition in ')
    }
    static update = (req, res) => {
        Helper.handlingMyFunction(req, res, async (req) => {
            const country = await Helper.isThisIdExistInThisModel(req.params.id, null, countryModel, 'country')
            for (let field in req.body) {
                if (!['_id', 'countryName'].includes(field) && req.body[field]) { country[field] = req.body[field] }
            }
            if (true) {
                return country.save()
            }
        }, 'you update this country successfully ')
    }
    static delete = (req, res) => {
        Helper.handlingMyFunction(req, res, async (req) => {
            const result = await countryModel.findByIdAndDelete(req.params.id)
            if (!result) {
                const e = new Error('there is no such a country')
                e.name = 'CastError'
                throw e
            }
            if (true) {
                return result
            }
        }, 'you deleted country successfully ')
    }
    static getAll = (req, res) => {
        Helper.handlingMyFunction(req, res, (req) => {
            return countryModel.find()
        }, 'here are all your countries')
    }
    static getAllAcessable = (req, res) => {
        Helper.handlingMyFunction(req, res, (req) => {
            return countryModel.find({countryName:{$ne:'final'}})
        }, 'here are all your countries')
    }
}
module.exports = Country