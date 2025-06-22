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

const port= process.env.APP_PORT || 8002
server.listen(port,()=>{
    console.log("Server running on the "+port);
})