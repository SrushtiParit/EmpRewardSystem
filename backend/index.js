const express = require('express');
const cors = require("cors");
require('./db/config');
const app = express();
const User = require("./Models/users");
const Employee = require("./Models/Employee");
const RewardCatelog = require("./Models/RewardCatelog")
const RedeemCatelog = require("./Models/RedeemCatelog")
const Product = require("./Models/Product")
const EmpRoutes = require("./Routes/EmployeeRoutes");
const TonyRoutes = require("./Routes/TonyRoutes"); 
const jwt = require("jsonwebtoken");
const multer = require('multer');
const RedeemRoutes = require("./Routes/RedeemRoutes");
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
const secretKey = "secretKey"
let bFlag = false;
let name ='';
let role ='';
let image = '';


// app.post("/register", async (req, resp)=>{
//     let user = new User(req.body);
//     let result = await user.save();
//     result = result.toObject();
//     jwt.sign({result}, secretKey, {expiresIn:'2h'}, (err, token)=>{
//       resp.json({
//         token,
//         name:result.name,
//         role: result.role
//       })
//     })
// });


const upload = multer({
  storage: multer.memoryStorage(), // Use memory storage to store file in memory as Buffer
});

app.post("/register", upload.single("photo"), async (req, resp) => {
  try {
    // Access form fields from req.body
    const { name, email, password, phone, role, gender, tnc } = req.body;

    // Access the photo data from req.file.buffer
    const photo = req.file ? req.file.buffer : undefined;

    const newUser = new User({
      name,
      email,
      password,
      phone,
      role,
      gender,
      tnc,
      photo,
    });

    const savedUser = await newUser.save();

    if (savedUser) {
      const user = savedUser.toObject();
      jwt.sign({ user }, secretKey, { expiresIn: "2h" }, (err, token) => {
        resp.json({
          token,
          name: user.name,
          role: user.role,
          image: user.photo
        });
      });
    } else {
      resp.status(500).json({ error: "Unable to save user data" });
    }
  } catch (error) {
    console.warn("error"+error);
    resp.status(500).json({ error: "Internal Server Error" });
  }
});


///////////////////////////////login//////////////////////////////////////////////////////////////////////
app.post("/login", async (req, resp) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
        return resp.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return resp.status(401).json({ error: "Incorrect credentials. Please enter valid details." });
    }

    // Compare the provided password with the stored password
    if (password === user.password) {
        // Generate and sign JWT token
        const token = jwt.sign({ user }, secretKey, { expiresIn: '2h' });

        // Return the token, name, and role in the response
        resp.json({
            token,
            name: user.name,
            role: user.role,
            image: user.photo
        });
    } else {
        // Password is incorrect
        resp.status(401).json({ error: "Incorrect credentials. Please enter valid details." });
    }
    } catch (error) {
        console.error("An error occurred:", error);
        resp.status(500).json({ error: "Internal server error. Please try again later." });
    }

  });
/////////////////////////get employees///////////////////////////////////////////
app.get("/employee/:key?", EmpRoutes);

///////////////////////////////////////////////////////////////////////////////////////////////////////
app.post("/registerEmp",EmpRoutes);

  app.post("/addTony", TonyRoutes);
/////////////////////////Api for display tony details is ready//////////////////
  app.get("/tonyDetails/:name", TonyRoutes);
////////////////////////////////////////////////////////

////////////////api for edit the tony////////////////////
app.put("/edittony/:id", TonyRoutes);
/////////////////////////////////////////////////////////
////////////redeem tony//////////////////////////////////
app.post('/redeem-tony', RedeemRoutes);
/////////////////////////////////////////////////////////
/////////add products/////////////////////////////
app.post("/addProducts", RedeemRoutes);
//////////////////////////////////////////////////////

///////////fetch the redeem records history//////////
app.get("/redeem-history", RedeemRoutes);
//////////////////////////////////////////////////////

////////////////fetch the products list///////////////
app.get("/products", RedeemRoutes);
///////////////////////////////////////////////////////

////////////////get all users ////////////////////////
app.get("/allUsers", EmpRoutes);
///////////////////////////////////////////////////////
  app.post("/authenticateUser", async(req, resp)=>{
    const tokenFromBody = req.body.token;
    if (typeof tokenFromBody !== 'undefined') {
      jwt.verify(tokenFromBody, secretKey, (err, authData) => {
        if (authData) {
          name = authData.user.name;
          role = authData.user.role;
          image = authData.user.photo;
          bFlag = true;
        }

        if (err) {
          console.warn("Error: " + err);
          bFlag = false;
        } 
      });
    }
    if(image)
    {
      resp.send({userName: name, userRole: role, userImage: image, isAuthenticated: bFlag});
    }
    else
    {
      resp.send({userName: name, userRole: role, isAuthenticated: bFlag});
    }
    
  });
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////

app.listen(5000)