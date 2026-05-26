// ================= BACKEND (Node.js + Express + MongoDB + LOGIN SYSTEM) =================

// Install:
// npm init -y
// npm install express mongoose cors bcryptjs jsonwebtoken

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "payroll_secret_key";

// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/payrollDB")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

// ================= USER (ADMIN) =================
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model("User", userSchema);

// Register Admin
app.post("/register", async (req,res)=>{
  const hashed = await bcrypt.hash(req.body.password,10);
  const user = new User({username:req.body.username,password:hashed});
  await user.save();
  res.send("Admin Registered");
});

// Login Admin
app.post("/login", async (req,res)=>{
  const user = await User.findOne({username:req.body.username});
  if(!user) return res.send("User not found");

  const isMatch = await bcrypt.compare(req.body.password,user.password);
  if(!isMatch) return res.send("Wrong password");

  const token = jwt.sign({id:user._id},SECRET);
  res.json({token});
});

// Middleware
function auth(req,res,next){
  const token = req.headers["authorization"];
  if(!token) return res.send("Access Denied");

  try{
    jwt.verify(token,SECRET);
    next();
  }catch{
    res.send("Invalid Token");
  }
}

// ================= EMPLOYEE =================
const employeeSchema = new mongoose.Schema({
  empId: String,
  name: String,
  basic: Number,
  hra: Number,
  allowance: Number
});

const Employee = mongoose.model("Employee", employeeSchema);

// Add Employee (Protected)
app.post("/add", auth, async (req,res)=>{
  const emp = new Employee(req.body);
  await emp.save();
  res.send("Employee Added");
});

// Payroll (Protected)
app.get("/payroll", auth, async (req,res)=>{
  const data = await Employee.find();

  const result = data.map(emp=>{
    const gross = emp.basic + emp.hra + emp.allowance;
    const pf = Math.min(emp.basic,15000) * 0.12;
    const esi = gross <= 21000 ? gross * 0.0075 : 0;
    const tds = gross * 0.10;
    const net = gross - (pf + esi + tds);

    return {...emp._doc, gross, pf, esi, tds, net};
  });

  res.json(result);
});

app.listen(5000, ()=>console.log("Server running on port 5000"));


// ================= FRONTEND (LOGIN + DASHBOARD) =================

/*
<!DOCTYPE html>
<html>
<head>
<title>Payroll Login</title>
<style>
body{font-family:Arial;text-align:center;background:#f5f5f5}
input,button{padding:10px;margin:5px}
table{margin:auto;border-collapse:collapse;width:80%}
th,td{border:1px solid black;padding:10px}
th{background:black;color:white}
</style>
</head>
<body>

<h2>Admin Login</h2>
<input id="username" placeholder="Username">
<input id="password" type="password" placeholder="Password">
<button onclick="login()">Login</button>

<div id="dashboard" style="display:none">
<h2>Payroll Dashboard</h2>

<input id="empId" placeholder="Emp ID">
<input id="name" placeholder="Name">
<input id="basic" placeholder="Basic">
<input id="hra" placeholder="HRA">
<input id="allowance" placeholder="Allowance">
<button onclick="addEmployee()">Add</button>

<br><br>
<button onclick="loadPayroll()">Show Payroll</button>

<table id="table"></table>
</div>

<script>
let token = "";

async function login(){
  const res = await fetch("http://localhost:5000/login",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      username:username.value,
      password:password.value
    })
  });

  const data = await res.json();
  token = data.token;

  if(token){
    document.getElementById("dashboard").style.display="block";
    alert("Login Success");
  }
}

async function addEmployee(){
  await fetch("http://localhost:5000/add",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":token
    },
    body:JSON.stringify({
      empId:empId.value,
      name:name.value,
      basic:Number(basic.value),
      hra:Number(hra.value),
      allowance:Number(allowance.value)
    })
  });
  alert("Added");
}

async function loadPayroll(){
  const res = await fetch("http://localhost:5000/payroll",{
    headers:{"Authorization":token}
  });

  const data = await res.json();

  let table = document.getElementById("table");
  table.innerHTML = `
  <tr>
  <th>ID</th><th>Name</th><th>Gross</th><th>PF</th><th>ESI</th><th>TDS</th><th>Net</th>
  </tr>`;

  data.forEach(emp=>{
    table.innerHTML += `
    <tr>
    <td>${emp.empId}</td>
    <td>${emp.name}</td>
    <td>${emp.gross}</td>
    <td>${emp.pf}</td>
    <td>${emp.esi}</td>
    <td>${emp.tds}</td>
    <td>${emp.net}</td>
    </tr>`;
  });
}
</script>

</body>
</html>
*/

// ================= HOW TO USE =================

// 1. Run server: node server.js
// 2. First register admin using Postman:
//    POST http://localhost:5000/register
//    {"username":"admin","password":"1234"}
// 3. Open HTML file
// 4. Login → Access dashboard

// ================= ADD SALARY SLIP PDF =================

// Install extra:
// npm install pdfkit

const PDFDocument = require("pdfkit");
const fs = require("fs");

// Generate Salary Slip
app.get("/salary-slip/:id", auth, async (req,res)=>{
  const emp = await Employee.findById(req.params.id);

  const gross = emp.basic + emp.hra + emp.allowance;
  const pf = Math.min(emp.basic,15000) * 0.12;
  const esi = gross <= 21000 ? gross * 0.0075 : 0;
  const tds = gross * 0.10;
  const net = gross - (pf + esi + tds);

  const doc = new PDFDocument();
  const filename = `salary_${emp.name}.pdf`;

  res.setHeader("Content-Type","application/pdf");
  res.setHeader("Content-Disposition",`attachment; filename=${filename}`);

  doc.pipe(res);

  doc.fontSize(20).text("Salary Slip",{align:"center"});
  doc.moveDown();

  doc.text(`Employee ID: ${emp.empId}`);
  doc.text(`Name: ${emp.name}`);
  doc.moveDown();

  doc.text(`Basic: ₹${emp.basic}`);
  doc.text(`HRA: ₹${emp.hra}`);
  doc.text(`Allowance: ₹${emp.allowance}`);
  doc.text(`Gross: ₹${gross}`);
  doc.moveDown();

  doc.text(`PF: ₹${pf}`);
  doc.text(`ESI: ₹${esi}`);
  doc.text(`TDS: ₹${tds}`);
  doc.moveDown();

  doc.text(`Net Salary: ₹${net}`);

  doc.end();
});

// ================= FRONTEND BUTTON =================

// Add this inside table row in HTML:
// <td><button onclick="downloadSlip('${emp._id}')">Download</button></td>

// Add function:

async function downloadSlip(id){
  window.open(`http://localhost:5000/salary-slip/${id}?token=${token}`);
}

// DONE 🔥 (PDF ADDED)
