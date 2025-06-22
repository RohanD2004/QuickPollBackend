const express= require('express');
const app = express()
const cors= require("cors");
const dotenv= require('dotenv').config();
const router= require('./routes/routes')
const dbConnect= require('./dbconfig');
const http = require('http');
const socketIo = require('socket.io');
const Poll= require('./model/poll');
dbConnect();
app.use(express.json());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});
app.use(cors({
    origin:'*'
}))
app.use('/',router);

io.on('connection', (socket) => {

  socket.on('vote', async ({ pollId, optionIndex }) => {
    try {
      const poll = await Poll.findById(pollId);
      if (!poll) return;

      if (poll.options[optionIndex]) {
        poll.options[optionIndex].votes += 1;
        await poll.save();

        io.emit('pollUpdated', poll); // broadcast updated poll
      }
    } catch (error) {
      console.error('Error processing vote:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});




setInterval(async () => {
    try {
      const now = new Date();

      const result = await Poll.updateMany(
        { expiresAt: { $lte: now }, isActive: true },
        { $set: { isActive: false } }
      );

      if (result.modifiedCount > 0) {
        console.log(`[Poll Expiry] Expired ${result.modifiedCount} poll(s) at ${now.toISOString()}`);
      }
    } catch (err) {
      console.error('[Poll Expiry Error]', err.message);
    }
  }, 60 * 1000);


const port= process.env.APP_PORT || 8002
server.listen(port,()=>{
    console.log("Server running on the "+port);
})