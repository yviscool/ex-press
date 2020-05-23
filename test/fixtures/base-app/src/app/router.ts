export default (app) => {
    app.get('/router/test', async(req,res,next)=>{
        res.send("zjl")
    })
}