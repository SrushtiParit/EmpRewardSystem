const express = require('express');
const cors = require("cors");
const router = express.Router();
require('../db/config');
const RewardCatelog = require("../Models/RewardCatelog");
const Employee = require("../Models/Employee");
const RedeemCatelog = require("../Models/RedeemCatelog");
const Product = require("../Models/Product");

router.use(express.json());
router.use(cors());

///////API to redeem-tony//////////////////////////////////////////////////////
router.post('/redeem-tony',async(req, resp)=> {
  const person = req.body.selectedName;
  const product  = req.body.selectedProduct;
  const emp = await Employee.findOne({name:person})
  const allocatedTonies = await RewardCatelog.find({
      name: person,
      status: { $in: ['Partially Redeemed', 'Allocated'] }
    }).sort({ status: -1 });
  const productdetails = await Product.findOne({name: product})
  let productPrice = productdetails.tony;
  
  let redeemSuccessful = false;
  for(const tony of allocatedTonies)
  {
    if(productPrice >= tony.tonies)
    {
      productPrice = productPrice - tony.tonies;
      tony.tonies = 0;
      tony.status = "Redeemed";
      await tony.save();
      if(productPrice === 0)
      {
        redeemSuccessful = true;
        break;
      }
    }
    else if(productPrice < tony.tonies && productPrice>0)
    {
      tony.tonies = tony.tonies - productPrice;
      tony.status="Partially Redeemed";
      await tony.save();
      redeemSuccessful = true;
      break;
    }
  }
  if(redeemSuccessful)
  {
    emp.balanceTony = emp.balanceTony - productdetails.tony
    await emp.save();
    let redeemHistory = new RedeemCatelog({name:person, tonies:productdetails.tony,product: product});
    await redeemHistory.save();
  }
  console.log("the employee balance is "+ emp.balanceTony);
  resp.send("success");
});

/////////////////////API to add products//////////////////
router.post("/addProducts", async(req, resp)=>{
  let products = new Product(req.body);
  let result = await products.save();
  result = result.toObject();
  resp.send(result);
})
//////////////////////////////////////////////////////////////

///////////////////API to get the redeem history /////////////
router.get("/redeem-history", async (req, resp) => {
  try {
    let redeemHistory = await RedeemCatelog.find();
    resp.send(redeemHistory);
  } catch (error) {
    console.error(error);
    resp.status(500).send("Internal Server Error");
  }
});
//////////////////////////////////////////////////////////////

///////////////API to get the products list while redeem/////////
router.get("/products", async(req, resp)=>{
  let product = await Product.find();
  resp.send(product);
});
/////////////////////////////////////////////////////////////////

module.exports = router;