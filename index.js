import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import { resolveInclude } from "ejs";

const app = express();
const port = 3000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Authentication",
  password: "1234",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
  
});

app.post("/register", async (req, res) => {
  const  email = req.body.username
  const password = req.body.password

  try{
   const checkResult = await db.query(`SELECT *   FROM users WHERE email =$1`[email],)

   if(checkResult.rows.length >0){
    res.send(" Email already exists . Try logging in .")
   }
   else{
    await db.query(`INSERT into users (email, password ) VALUES  ($1,$2)`,[email,password])
   }
  
  res.render("secrets.ejs");
}
catch(err){
  console.log(err)
}
})


app.post("/login", async (req, res) => {
  const  email = req.body.username
  const password = req.body.password

  console.log(email);
  console.log(password);
  try{
   const result = await db.query (`SELECT  email, password FROM users WHERE email = $1`, [email])

   if (result.rows.length >0){
    if(password == result.rows[0].password){
      res.render("secrets.ejs")
     } else {
      res.send ("Incorrect Password");
     }
   } else {
    res.send (" User not found")
   }
   console.log(result.rows)
   
  }catch (err){
    console.log(err)
   }
   });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
