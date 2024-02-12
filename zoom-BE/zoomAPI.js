require("dotenv").config();
const axios = require("axios");
const btoa = require("btoa");

const getAccessToken = async () => {
  try {
    base_64 = btoa(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET);

    const resp = await axios({
      method: "POST",
      url:
        "https://zoom.us/oauth/token?grant_type=account_credentials&account_id=" +
        `${process.env.ACCOUNT_ID}`,
      headers: {
        Authorization: "Basic " + `${base_64} `,
      },
    });

    return resp.data.access_token;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

const listZoomMeetings = async (userId) => {
  const user = `${ userId ? userId: 'me' }`

  try {
    const resp = await axios({
      method: "get",
      url: `https://api.zoom.us/v2/users/${user}/meetings`,
      headers: {
        Authorization: "Bearer " + `${await getAccessToken()} `,
        "Content-Type": "application/json",
      },
    });
    const meetings = resp.data.meetings;

    // const newArray = meetings.map((obj) =>
    //   ["id", "topic"].reduce((newObj, key) => {
    //     newObj[key] = obj[key];
    //     return newObj;
    //   }, {})
    // );

    return meetings;
  } catch (err) {
    if (err.status == undefined) {
      console.log("Error : ", err);
    }
  }
};

const createZoomMeeting = async (data, userId) => {
  const user = `${ userId ? userId: 'me' }`

  try {
    const resp = await axios({
      method: "post",
      url: `https://api.zoom.us/v2/users/${user}/meetings`,
      headers: {
        Authorization: "Bearer " + `${await getAccessToken()} `,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    });

    // const a = await axios({
    //   method: "post",
    //   url: `https://api.zoom.us/v2/meetings/${resp.data.id}/invite_links`,
    //   headers: {
    //     Authorization: "Bearer " + `${await getAccessToken()} `,
    //     "Content-Type": "application/json",
    //   },
    //   data: JSON.stringify({ attendees: [{ name: "Jill Chill" }] }),
    // })

    // console.log(a.attendees)

    return resp.data;
  } catch (err) {
    if (err.status == undefined) {
      console.log("Error : ", err);
    }
  }
};

module.exports = {
  createZoomMeeting, 
  listZoomMeetings,
};