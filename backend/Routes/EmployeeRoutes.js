const express = require('express');
const cors = require("cors");
const router = express.Router();
require('../db/config');
const Employee = require("../Models/Employee");
const Users = require("../Models/users");

router.use(express.json());
router.use(cors());

router.get("/employee/:key?", async (req, resp) => {
    const search = req.params.key;

    if (search) {
        try {
            let employees = await Employee.find({
                "$or": [
                    { name: { $regex: req.params.key, $options: 'i' } }, // Case-insensitive search
                    { email: { $regex: req.params.key, $options: 'i' } },
                    { password: { $regex: req.params.key, $options: 'i' } },
                    { phone: { $regex: req.params.key, $options: 'i' } }
                ]
            });

            resp.send(employees);
        } catch (error) {
            resp.status(500).send({ error: 'Internal Server Error' });
        }
    } else {
        try {
            let employees = await Employee.find();
            resp.send(employees);
        } catch (error) {
            resp.status(500).send({ error: 'Internal Server Error' });
        }
    }
});

router.post("/registerEmp", async (req, resp) => {
    try {
        const newEmployee = new Employee(req.body);
        const savedEmployee = await newEmployee.save();

        if (savedEmployee) {
            const result = savedEmployee.toObject();
            resp.status(200).json(result); // Return the saved employee data
        } else {
            resp.status(500).json({ error: 'Unable to save employee data' });
        }
    } catch (error) {
        resp.status(500).json({ error: 'Internal Server Error' });
    }
});



router.get("/allUsers", async(req, resp)=>{
    try{
        let allUsers = await Users.find({},'-password');
        resp.send(allUsers);
    }
    catch(error)
    {
        resp.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;


