const roomModel = require('../models/room.js');

const joinRoom = async (req, res) => {
  try {
    const isRoomExist = await roomModel.findOne({ roomId: req.body.roomId });
    if (isRoomExist) {
      const newParticipant = {
        email: req.body.email,
        prefs: {
          audio: false,
          video: false,
          screen: false,
        },
      };

      const updatedRoom = await roomModel.findByIdAndUpdate(
        isRoomExist._id,
        {
          $push: { participants: newParticipant },
        },
        { new: true }
      );

      res.status(200).json({
        data: updatedRoom,
        message: 'Update Room',
      });
    } else {
      const newRoom = new roomModel({
        roomId: req.body.roomId,
        participants: [{ email: req.body.email }],
      });
      const savedRoom = await newRoom.save();
      res.status(201).json({
        data: newRoom,
        message: 'Create New Room',
      });
    }
  } catch (error) {
    res.status(500).json({
      data: null,
      message: error.message,
    });
  }
};

module.exports = { joinRoom };
