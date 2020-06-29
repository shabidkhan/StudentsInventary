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
        res.sendfile('./views/Article.html')
        
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
  data = (await knex('students').where({'email':uesr_arr[0].email}).select('*'));
  res.send(data)
})

app.post('/delete',async(req,res)=>{
  await knex('students').where({'email':uesr_arr[0].email}).del('*')
  data = (await knex('students').where({'email':uesr_arr[0].email}).select('*'));

  res.redirect('/')
})

app.post('/put',async(req,res)=>{ 
  res.sendfile('./Data/update.html')
  
})

app.post('/edit',async(req,res)=>{
  await knex('students')
  .where({'email':uesr_arr[0].email})
  .update(req.body)

  data = (await knex('students').where({'email':uesr_arr[0].email}).select('*'));
  res.redirect("/back")
})


app.get('/back',(req,res)=>{
  res.sendfile('./views/Article.html')
})

app.listen(2020,()=>{
    console.log('Working..!')
});