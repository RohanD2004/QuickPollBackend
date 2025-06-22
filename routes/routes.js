const router= require('express').Router();
const {signup,loginuser,getUser}= require('../controller/usercontroller');
const {createPoll,getPolls,getAllPollsWithUser}=require('../controller/pollcontroller')
const verifyToken = require('../middleware/authmiddleware');

router.post('/signup',signup);
router.post('/login',loginuser);
router.post('/getUser',verifyToken,getUser);

router.post('/createpoll',verifyToken,createPoll);
router.post('/getpolls',verifyToken,getPolls);
router.post('/getallpolls',getAllPollsWithUser);


module.exports=router;
