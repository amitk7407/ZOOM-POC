require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const {
  getMeetingSDKSignature,
  CreateMeeting,
  ScheduleMeeting,
  ListMeetings,
  ListRecordings
} = require("./zoomController.js");

const app = express()
const port = process.env.PORT || 4000

app.use(bodyParser.json(), cors())
app.options('*', cors())


app.post('/generate-zoom-signature', getMeetingSDKSignature);
app.post('/create-meeting', CreateMeeting);
app.post('/schedule-meeting', ScheduleMeeting);
app.get('/list-meetings', ListMeetings);
app.get('/list-recordings', ListRecordings);

app.listen(port, () => console.log(`Zoom Meeting SDK Auth Endpoint Sample Node.js listening on port ${port}!`))
