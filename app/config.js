require('../db/connection')
const express=require('express')
const path=require('path')
const cors=require('cors')
const app=express()
app.use(cors())
app.use(express.json({limit:'200mb'}))
app.use(express.urlencoded({extended:true,limit:'200mb'}))
app.use(express.static(path.join(__dirname,'../statics')))
//routes
app.use(express.static(path.join(__dirname,'../statics/STS-Frontend-Website',)))
app.get('/',(req,res)=>{
    // res.status(200).sendFile(path.join(__dirname,'../statics/STS-Frontend-Website/STS Website.html'))
})
const userRoutes=require('../routes/user.routes')
const countryRoutes=require('../routes/country.routes')
const sponsorRoutes=require('../routes/sponsor.routes')
const newsRoutes=require('../routes/news.routes')
const advertisingRoutes=require('../routes/advertising.routes')
const roleRoutes=require('../routes/role.routes')
const competitionRoutes=require('../routes/competition.routes')
const subscriptionRoutes=require('../routes/subscription.routes')
const competitorRoutes=require('../routes/competitor.routes')
const entryRoutes=require('../routes/entry.routes')
app.use('/sts/entry',entryRoutes)
app.use('/sts/competitor',competitorRoutes)
app.use('/sts/subscription',subscriptionRoutes)
app.use('/sts/competition',competitionRoutes)
app.use('/sts/role',roleRoutes)
app.use('/sts/advertising',advertisingRoutes)
app.use('/sts/news',newsRoutes)
app.use('/sts/sponsor',sponsorRoutes)
app.use('/sts/country',countryRoutes)
app.use('/sts/user',userRoutes)
module.exports=app