const Poll = require('../model/poll')
const mongoose = require('mongoose');

const createPoll = async (req, res) => {
    try {
        const { question, options, expiresAt, createdBy } = req.body.data;


        if (!question || !options || options.length !== 4 || !expiresAt) {
            return res.status(400).json({ message: 'Invalid input. Question, 4 options, and expiry date are required.' });
        }


        const formattedOptions = options.map((opt) => ({
            text: opt.text,
            votes: 0,
        }));

        const newPoll = new Poll({
            question,
            options: formattedOptions,
            expiresAt: new Date(expiresAt),
            createdBy: createdBy || null
        });

        const savedPoll = await newPoll.save();
        return res.status(201).json({
            message: 'Poll created successfully',
            data: savedPoll
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error while creating poll' });
    }
};



const getPolls = async (req, res) => {
  const userId = req.body.id;

  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid User ID' });
    }

    // Find polls with matching `createdBy` field
    const polls = await Poll.find({ createdBy: userId }).sort({ createdAt: -1 });

    if (polls.length === 0) {
      return res.status(404).json({ message: 'No polls found for this user' });
    }

    return res.status(200).json({ message: 'Polls fetched successfully', data: polls });

  } catch (error) {
    return res.status(500).json({ message: 'Server error while fetching user polls' });
  }
};

const getAllPollsWithUser = async (req, res) => {
  try {
    const polls = await Poll.find()
      .populate({
        path: 'createdBy',
        select: 'name email' // Include only required user fields
      })
      .sort({ createdAt: -1 }); // optional: newest first

    if (polls.length === 0) {
      return res.status(404).json({ message: 'No polls found' });
    }

    return res.status(200).json({ message: 'Polls fetched successfully', data: polls });

  } catch (error) {
    return res.status(500).json({ message: 'Server error while fetching polls' });
  }
};




module.exports = {
    createPoll,
    getPolls,
    getAllPollsWithUser
}