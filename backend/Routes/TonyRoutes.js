const express = require('express');
const cors = require("cors");
const router = express.Router();
require('../db/config');
const RewardCatelog = require("../Models/RewardCatelog");
const Employee = require("../Models/Employee");

router.use(express.json());
router.use(cors());

//get tony details with below API////////////////////
router.get("/tonyDetails/:name", async (req, res) => {
    const Name = req.params.name; 
    let result = await RewardCatelog.find({name: Name});
    res.json(result);
});

////edit tony with below API//////////////
router.put("/edittony/:id", async(req, resp)=>{
    let result = await RewardCatelog.updateOne(
      {_id: req.params.id},
      {
        $set: req.body
      }
    )
  
    const updatedRewards = await RewardCatelog.find({
        name: req.body.name,
        status: { $in: ['Allocated', 'Partially Redeemed'] }
      });
        let totalTonies = 0;
  
        for (const reward of updatedRewards) {
            totalTonies += reward.tonies;
        }        
          const empName = req.body.name;
          await Employee.updateOne(
              { name: empName },
              { $set: { balanceTony: totalTonies } }
          );
    resp.send(result);
});

///////add tony with the below API//////////////////
router.post("/addTony", async(req, resp)=>{
    const Name = req.body.name;
    const emp = await Employee.findOne({name:Name});
    const toniesToAdd = req.body.tonies;
    emp.balanceTony += toniesToAdd;
    await emp.save()
    const reward = new RewardCatelog(req.body)
    let result = await reward.save()
    resp.send(result);
  }); 




module.exports = router;

