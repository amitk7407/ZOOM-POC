import React, { useState } from 'react';
import { useNavigate } from 'react-router';

import { JoinMeetingModal } from './JoinMeetingModal';
import { ScheduleMeetingModal } from './ScheduleMeetingModal';

import './App.css';

export const App: React.FC = () => {
  const navigate = useNavigate()

  const [showJoinModal, setShowJoinModal] = useState<boolean>(false);
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [meetingList, setMeetingList] = useState<
    { id: number; topic: string }[]
  >([]);

  // const getMeetingList = () => {
  //   fetch('http://localhost:4000/list-meetings', {
  //     method: 'GET',
  //     headers: { 'Content-Type': 'application/json' }
  //   })
  //     .then(res => res.json())
  //     .then(response => {
  //       console.log(response);
  //       setMeetingList(response.meetings);
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // };

  const createMeeting = () => {
    fetch('http://localhost:4000/create-meeting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        invitees: [
          'amit.jnit1@gmail.com',
          'mohit.kumar@arbolus.com',
          'amit.kumar@arbolus.com'
        ]
      })
    })
      .then(res => res.json())
      .then(response => {
        console.log(response.start_url);
        let queryString = response.start_url.split('?')[1];
        queryString = queryString ? queryString.split('#')[0] : '';
        const arr = queryString.split('&');
        console.log(arr.length);
        let zakToken = '';
        arr.forEach((element: string) => {
          const param = element.split('=');
          zakToken = param[0] === 'zak' ? param[1] : '';
        });

        navigate(`/meeting?mn=${response.id}&email=amit.kumar@arbolus.com&role=1&pwd=${response.password}&zak=${zakToken}`);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div className='app'>
      {/* <button className='btn' onClick={getMeetingList}>List Meetings</button> */}
      <button className='btn btn-danger' onClick={createMeeting}>Create Meeting</button>
      <button className='btn btn-primary' onClick={() => setShowScheduleModal(true)}>Schedule Meeting</button>
      <button className='btn btn-primary' onClick={() => setShowJoinModal(true)}>Join Meeting</button>
      <JoinMeetingModal showJoinModal={showJoinModal} onClose={() => setShowJoinModal(false)} />
      <ScheduleMeetingModal showScheduleModal={showScheduleModal} onClose={() => setShowScheduleModal(false)} />
      {meetingList.map(meeting => (
        <h2 key={meeting.id}>{meeting.topic}</h2>
      ))}
    </div>
  );
}

