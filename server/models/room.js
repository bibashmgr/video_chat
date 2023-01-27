const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    require: true,
  },
  participants: [
    {
      email: {
        type: String,
        require: true,
      },
      prefs: {
        audio: {
          type: Boolean,
          default: false,
        },
        video: {
          type: Boolean,
          default: false,
        },
        screen: {
          type: Boolean,
          default: false,
        },
      },
    },
  ],
});

module.exports = mongoose.model('rooms', roomSchema);
