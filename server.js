const express = require("express")
const app = express()
const bodyParser = require("body-parser")
var knex = require('knex')({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : 'shabid@21',
      database : 'students_details'
    }
  });

app.use(bodyParser.urlencoded({extended:true}))

app.use(express.json())

app.get('/',function(req,res){
    res.sendfile('./views/LogIn.html');
});

app.get('/SignUp',function(req,res){
    res.sendfile('./views/SignUp.html');
});

app.get('/database',async(req,res)=>{
    var result = await knex.select('*').table('students');
    res.send(result);
  })


app.post('/LoggedIn',async(req,res)=>{
    var EmailData =await (await knex.select('email').table('students'));
    var user = req.body.username
    var pasd = req.body.password
    condition = false
    uesr_arr=[]
    for (i of EmailData){  
      if (user == i.email){
          uesr_arr.push(i)
        condition = true
        break
      }
    }
    if(condition) {
      console.log('ok');
      PasswordData = await knex("students").where({"Email" :user}).select('password');
      if(pasd == PasswordData[0].password){
        if (uesr_arr[0].email=="shabid19@navgurukul.org"){
          res.sendfile('./views/ArticleAdmin.html')
          }else{
        res.sendfile('./views/Article.html')
          }
      }else{
        res.send('<h1 style="color:red;">Invalid password go back and try again</h1>')
      }
    }else{
      sendfile('./views/SignUp.html')

      
    }
  })

app.post('/Signup',async(req,res)=>{
  var EmailData =await (await knex.select('email').table('students'));
  var user = req.body.username
  condition = false
  uesr_arr=[]
  for (i of EmailData){  
    if (user == i.email){
      condition = true
      break
    }
  }
  if (condition){
    res.send("<h1 style='color:red'>This email already exits go back and try to another email<h1>")
  }else{
    SubmitData={
      email: req.body.username,
      password: req.body.password,
      fname: req.body.fname,
      lname: req.body.lname,
      pnumber: req.body.pnumber,
      addresh: req.body.addresh,
      dob: req.body.dob
    }
    console.log(SubmitData);
    
    await knex.insert(SubmitData).into('students')
    res.redirect('/')
  }
})

app.post('/get',async(req,res)=>{
  console.log(uesr_arr[0])
  if (uesr_arr[0].email=="shabid19@navgurukul.org"){
    uesr_arr.push({'email':req.body.username})
  }else{
    uesr_arr.push(uesr_arr[0])
  }
  
  data = (await knex('students').where({'email':uesr_arr[1].email}).select('*'));
  res.send(data)
})

app.post('/delete',async(req,res)=>{
  if (uesr_arr[0].email=="shabid19@navgurukul.org"){
    uesr_arr.push({'email':req.body.username})
  }else{
    uesr_arr.push(uesr_arr[0])
  }
  await knex('students').where({'email':uesr_arr[1].email}).del('*')
  res.redirect('/')
})

app.post('/put',async(req,res)=>{ 
  if (uesr_arr[0].email=="shabid19@navgurukul.org"){
    uesr_arr.push({'email':req.body.username})
  }else{
    uesr_arr.push(uesr_arr[0])
  }
  res.sendfile('./Data/update.html')
  
})

app.post('/edit',async(req,res)=>{
  await knex('students')
  .where({'email':uesr_arr[1].email})
  .update(req.body)
  res.redirect("/back1")
  
})

app.get('/back1',(req,res)=>{
  if (uesr_arr[0].email=='shabid19@navgurukul.org'){
    res.redirect("/backAdmin")
  }else{
  res.redirect("/back")
  }
})
app.get('/back',(req,res)=>{
  res.sendfile('./views/Article.html')
})
app.get('/backAdmin',(req,res)=>{
  res.sendfile('./views/ArticleAdmin.html')
})

app.listen(2020,()=>{
    console.log('Working..!')
});