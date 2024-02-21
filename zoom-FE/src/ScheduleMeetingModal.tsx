import React, { useState } from 'react';
import { createPortal } from 'react-dom';

import './App.css';

const modalRoot = document.getElementById('modal-root');

export const ScheduleMeetingModal: React.FC<{ showScheduleModal: boolean; onClose: () => void; }> = ({ showScheduleModal, onClose }) => {
  const [meetingTime, setMeetingTime] = useState<string>('');
  const [topic, setTopic] = useState<string>('');

  const scheduleMeeting = () => {
    fetch('http://localhost:4000/schedule-meeting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        invitees: [
          'amit.jnit1@gmail.com',
          'mohit.kumar@arbolus.com',
          'amit.kumar@arbolus.com'
        ],
        startTime: new Date(meetingTime),
        topic
      })
    })
      .then(res => res.json())
      .then(response => {
        console.log(response);
        onClose();
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <>
      {showScheduleModal && createPortal(
        <div className="modal">
          <div className="form-container">
            <div className='imgContainer'>
                <img src='/logo-connect.svg' alt='arbolus' />
                <label>Arbolus Connect</label>
              </div>
              <div className='form'>
                <label>
                  Meeting Topic:
                  <input
                    type="text"
                    value={topic}
                    name="topic"
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </label>
                <label>
                  Meeting Time:
                  <input type="datetime-local" id="start_time" name="start_time" onChange={e => setMeetingTime(e.target.value)}/>
                </label>
                <button className='button' onClick={scheduleMeeting}>Schedule Meeting</button>
              </div>
            <button onClick={onClose}>Close</button>
          </div>
        </div>,
        modalRoot as HTMLElement
      )}
    </>
  );
}

