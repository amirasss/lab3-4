const express = require('express')
const app = express()
const port = 3000
const fs = require("fs");
const { validateUser } = require('./userHelpers')
const userRouter=require('./routers/userRouter')
const bodyparser = require('body-parser')
const { logRequest } = require('./generalHelpers')
app.use(bodyparser.json());
app.use('/users',userRouter)


app.use(logRequest)

app.use((err,req,res,next)=>{
  if(err.status>500){
    return res.status(500).send({error:"onternal server error"})
  }
  res.status(err.status).send(err.message)

})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})