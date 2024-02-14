const asyncHandler = require("express-async-handler");

require("dotenv").config();
const KJUR = require("jsrsasign");

const {
  createZoomMeeting,
  listZoomMeetings,
  ListZoomRecordings
} = require("./zoomAPI.js");

const getMeetingSDKSignature = asyncHandler(async (req, res) => {
  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;

  const oHeader = { alg: "HS256", typ: "JWT" };

  const oPayload = {
    sdkKey: process.env.ZOOM_MEETING_SDK_KEY,
    appKey: process.env.ZOOM_MEETING_SDK_KEY,
    mn: req.body.meetingNumber,
    role: req.body.role,
    iat: iat,
    exp: exp,
    tokenExp: exp
  };

  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);
  const signature = KJUR.jws.JWS.sign(
    "HS256",
    sHeader,
    sPayload,
    process.env.ZOOM_MEETING_SDK_SECRET
  );

  res.json({ signature });
});

const CreateMeeting = asyncHandler(async (req, res) => {
  const { invitees, topic } = req.body;
  
  const data = {
    password: "123456",
    settings: {
      // "auto_recording":"local",
      email_notification: true,
      meeting_authentication: true,
      meeting_invitees: invitees.map(invitee => ({
        email: invitee
      })),
      registration_type: 1,
      // join_before_host: true, // Enable 'Join Before Host'
      waiting_room: false,
      host_video: true,
      participant_video: true,
    },
    topic,
    type: 1
  }

  const data1 = await createZoomMeeting(data);

  res.status(201).json(data1);
});


const ScheduleMeeting = asyncHandler(async (req, res) => {
  const { invitees, startTime, userId,topic } = req.body;

  const data = {
    password: "123456",
    settings: {
      // "auto_recording":"local",
      email_notification: true,
      meeting_authentication: true,
      meeting_invitees: invitees.map(invitee => ({
        email: invitee
      })),
      registration_type: 1,
      // join_before_host: true, // Enable 'Join Before Host'
      waiting_room: false,
      host_video: true,
      participant_video: true,
    },
    timezone: 'UTC',
    start_time: startTime,
    topic,
    type: 2
  }

  const data1 = await createZoomMeeting(data, userId);

  res.status(201).json(data1);
});


const ListMeetings = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const meetings = await listZoomMeetings(userId);
  if (meetings === undefined) {
    res.status(400);
    throw new Error("No meeting found");
  } else {
    res.status(201).json({ meetings });
  }
});

const ListRecordings = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const recordings = await ListZoomRecordings(userId);
  if (recordings === undefined) {
    res.status(400);
    throw new Error("No recording found");
  } else {
    res.status(201).json({ recordings });
  }
});


  module.exports = {
  getMeetingSDKSignature,
  CreateMeeting,
  ScheduleMeeting,
  ListMeetings,
  ListRecordings
};