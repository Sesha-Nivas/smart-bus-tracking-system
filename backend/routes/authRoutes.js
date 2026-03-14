const express = require("express");
const router = express.Router();
const db = require("../config/db");

// LOGIN
router.post("/login", async (req, res) => {

  const { email, password } = req.body;

  try {

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email=? AND password=?",
      [email, password]
    );

    if(rows.length === 0){
      return res.status(401).json({message:"Invalid credentials"});
    }

    const user = rows[0];

    res.json({
      id:user.id,
      name:user.name,
      role:user.role
    });

  } catch(error){
    console.error(error);
    res.status(500).json({error:error.message});
  }

});

router.post("/signup", async (req,res)=>{

  const {name,email,password,role} = req.body;

  try{

    await db.query(
      "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
      [name,email,password,role]
    );

    res.json({message:"User registered successfully"});

  }catch(error){

    console.error(error);
    res.status(500).json({error:error.message});

  }

});

module.exports = router;