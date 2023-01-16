const express = require("express");
const storage = require('node-persist');

const app = express();
// For parsing application/json
app.use(express.json());
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// serving home page for creating new record
app.get("/",(req,res)=>{
  res.sendFile(__dirname+"/pages/index.html")
})

// error html 
function errorHtml(msg="Something went wrong!!"){
  
  let errorHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>Student</title>
    </head>
    <body>
      <center>
        <br>
        <br>
        <div style="border: 2px solid lightgray; width: 30rem;">
          <h3 style="color:rgba(43, 43, 43, 0.885)">${msg}</h3>
      </div>
      </center>
    </body>
    </html>
  `
  return errorHtml;
}

// for creating new record
app.post("/newStudent",async (req,res)=>{
  try {
    const {id,name,gpa} = req.body;
    console.log(id,name,gpa)
    let data = await storage.getItem(id)
    if(!data){
      await storage.setItem(id,{
        id, name, gpa
      })
      res.send(errorHtml("Created succssfully.."))
    }else{
      res.status(203).send(errorHtml("Cannot create! Record already exist.."))
    }
  } catch (error) {
    res.status(203).send(errorHtml())
  }
})

// for fetching all students data
app.get("/allStudents",async (req,res)=>{
  try {
      let startHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <title>Student</title>
      </head>
      <body>
        <center>
          <br>
          <br>
          <div style="border: 2px solid lightgray; width: 30rem; line-height: 8px;">
            <h3 style="color:rgba(43, 43, 43, 0.885)">Student Details</h3>
      `
      const endHtml = `  </div>
        </center>
      </body>
      </html>
      `
      await storage.forEach(d=>{
        console.log(d);
        let data = `
          <hr/ style="color:lightgray">
          <h4 >Student ID : ${d.value.id}</h4>
          <h4 >Name : ${d.value.name}</h4>
          <h4 >GPA : ${d.value.gpa}</h4>
          `
        startHtml += data;
      })
      
      res.set("text/html").send(startHtml+endHtml)
      
  } catch (error) {
    res.status(203).send("Something went wrong!!")
  }
})

// for fetching topper students data
app.get("/topper",async (req,res)=>{
  try {
      let startHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <title>Student</title>
      </head>
      <body>
        <center>
          <br>
          <br>
          <div style="border: 2px solid lightgray; width: 30rem; line-height: 8px;">
            <h3 style="color:rgba(43, 43, 43, 0.885)">Student Details</h3>
      `
      const endHtml = `  </div>
        </center>
      </body>
      </html>
      `
      let data = null;
      await storage.forEach(d => {
        // console.log(d);
        if(data==null){
          data = d
        }
        if((parseFloat(data.value.gpa) < parseFloat(d.value.gpa))){
          console.log(d)
          data = d;
        }
      })

      startHtml += `
          <hr/ style="color:lightgray">
          <h4 >Student ID : ${data.value.id}</h4>
          <h4 >Name : ${data.value.name}</h4>
          <h4 >GPA : ${data.value.gpa}</h4>
          `
      res.set("text/html").send(startHtml+endHtml)
      
  } catch (error) {
    res.status(203).send("Something went wrong!!")
  }
})

// for fetching specific student data
app.get("/student/:sid", async (req,res)=>{
  try {
    if(req.params.sid){

      const student = await storage.getItem(req.params.sid);

      let resHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <title>Student</title>
      </head>
      <body>
        <center>
          <br>
          <br>
          <div style="border: 2px solid lightgray; width: 30rem; line-height: 8px;">
            <h3 style="color:rgba(43, 43, 43, 0.885)">Student Details</h3>
            <hr/ style="color:lightgray">
            <h4 >Student ID : ${student.id}</h4>
            <h4 >Name : ${student.name}</h4>
            <h4 >GPA : ${student.gpa}</h4>
        </div>
        </center>
      </body>
      </html>
      `
        res.set("text/html").send(resHtml)
    }
  } catch (error) {
    res.status(203).send(errorHtml("Record not found!"))
  }
})

// starting server on port 5000
app.listen(5000, async ()=>{
  await storage.init({
    dir: __dirname+'/data_persist',
    stringify: JSON.stringify,
    parse: JSON.parse,
    encoding: 'utf8',
  });
  console.log('Server start on http://localhost:5000/')
})