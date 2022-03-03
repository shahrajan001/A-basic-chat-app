const mongoose = require("mongoose");
const connectionURL = process.env.MONGODB_URL;
// const connectionURL = 'mongodb://127.0.0.1:27017/taskmanager-apifinal'
mongoose.connect(connectionURL, {
    useNewURLParser: true,
    // useCreateIndex: true
});
