const express = require("express");
const app = express();
app.use (express.json());
const port = 1234;
const uuid = require('uuid').v4

const db = require("mysql2");

const sql = db.createConnection({
database: "CODEWAVE",
user:     "root",
password: "root",
})
sql.connect((err) => {
  if (err) {
    console.log("Unable to connect to db because " + err.message);
  } else {
    console.log("Mysql connection established");
  }
});
//creating student
app.post("/student", (req,res)=>{
try {
  const  query= `insert into codewave.studenttable(fullname,email,stack)Values(?,?,?)`;
  const {fullname, email, stack}= req.body;
  sql.query(query,[fullname, email, stack],(err,data)=>{
   if (err){
    console.log(err.sqlmessage);
    res.status(400).json({error:err.sqlmessage})
   }else{
    return res.status(200).json({
      message:"new student created"
    });
   }
  })

  
} catch (error) {
  res.status(500).json({
    message: "internal server error",
    error: error.message
  })
}

})

//creating records in the store table
app.post('/student/:studentId', (req, res) => {
  const { studentId } = req.params
  const { punctuality, assignment } = req.body

  const totalScore = punctuality + assignment

  const query = `INSERT INTO codewave.studentscores (student_id, punctuality, assignment, totalScore) VALUES(?,?,?,?) `

  try {
    sql.query(query, [studentId, punctuality, assignment, totalScore], (err, data) => {
      if (err) {
        return res.status(400).json({
          message: 'Error',
          error: err.message,
        })
      } else {
        return res.status(200).json({
          message: 'scores successfully added',
        })
      }
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error adding scores',
      error: error.message,
    })
  }
})
// creating a new student and their score
app.post("/studentAndScore", (req,res)=>{
  const {fullname, email,stack,  punctuality, assignment}=req.body
  const studentId = uuid()
  const scoreId= uuid()
 
  const query = `insert into codewave.studenttable(student_id, fullname,email,stack)VALUES(?,?,?,?)`;
  try {
    sql.query(query,[studentId,fullname, email, stack], (err,data)=>{
      if(err){
        return res.status(400).json({
          message:'Error',
          error:err.message,
        })
      }
      const totalScore = punctuality + assignment
      const scoresQuary = `INSERT INTO codewave.studentscore(score_id,student_id,punctuality,assignment, totalScore)VALUES(?,?,?,?)`;
      if(err){
        return res.status(400).json({
          message:'error',
          error:err.message,

        })
      }else{
        return res.status(200).json({
          message: "Record added successfully",
        })
      }
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error',
      error:  error.message
    })
  }
})
//Retrive  all student and their  score
app.get('/getAllStudents', (req,res)=>{
const  query = `SELECT  s.fullname, sc.punctuality, sc.assignment, FROM codewave.studenttable join codewave.studentscores on s.student_id = sc.student_id`
sql.query(query,(err,data)=>{
  if(err){
    return res.status(400).json({
      message: 'error',
      error: err.message,
    })
  }else{
    return res.status(500).json({
      message:'data retrieved successfully',
      data : data,
    })
  }
  
})
})
try {
  
} catch (error) {
  return res.status(500).json({
    message: 'Error',
    error: error.message,
  })
}
//delete a students stack
app.put("/update/:studentId", (req, res)=>{
  const {stack}= req. body
   const  {studentId} = req.params

   const  query = `UPDATE codewave.studenttable SET stack = ? WHERE student_id = ${studentId} `
   try {
    sql.query(query,[stack,studentId], (err,data)=>{
      if(err){
        return res.status(400).json({
          message:'error',
          error:err.message,
        })
      }
    })
   } catch (error) {
    return res.status(500).json({
      message:'Error',
      error: err.message,
    })
   }
})

//delete a student and their score
app.delete("/deleteArecord/:studentId", (req, res)=>{
  const {studentId} = req.params
  const query = `delete from codewave.studenttable WHERE student_id = ${studentId}`;
  sql.query(query,(err,data)=>{
    if (err){
      return res.status(200).json({
        message:"record deleted successfully",
        data: data,
      })
    }
  })
  try {
    
  } catch (error) {
    return res.status(500).json({
      message:'error',
      error: error.message,
    })
  }
})
// to get all students and their scores and show Null where no score exists
app.get('/getAllstudentsWithLeftJoin', (req, res) => {
  try {
    const query =` SELECT students.fullName, scores.totalScore FROM  codewave.studenttable LEFT JOIN codewave.studentscores ON students.student_id =  scores.student_id`

    sql.query(query, (err, data) => {
      if (err) {
        return res.status(400).json({
          message: 'Error',
          error: err.message,
        })
      } else {
        return res.status(200).json({
          message: 'Successful',
          data: data,
        })
      }
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error',
      error: error.message,
    })
  }
})

app.get('/getAllstudentsWithRightJoin', (req, res) => {
  try {
    const query = `SELECT scores.totalScore, students.fullName FROM codewave.studenttable RIGHT JOIN codewave.studentscores ON students.student_id = scores.student_id`

    sql.query(query, (err, data) => {
      if (err) {
        return res.status(400).json({
          message: 'Error',
          Error: err.message,
        })
      } else {
        return res.status(200).json({
          message: 'Successfull',
          data: data,
        })
      }
    })
  } catch (error) {
    return res.status(200).json({
      message: 'Successful',
      data: data,
    })
  }
})


app.listen(port, ()=>{
  console.log (`server is running on port ${port}`)
})
