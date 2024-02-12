import React from 'react';
import { createPortal } from 'react-dom';

import './App.css';

const modalRoot = document.getElementById('modal-root');

export const ScheduleMeetingModal: React.FC<{ showScheduleModal: boolean; onClose: () => void; }> = ({ showScheduleModal, onClose }) => {
  const scheduleMeeting = () => {
    const time = document.getElementById('start_time') as HTMLInputElement;

    fetch('http://localhost:4000/schedule-meeting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        invitees: ["mohit.kumar@arbolus.com", "amitk7407@gmail.com", "amit.kumar@arbolus.com"],
        startTime: new Date(time.value),
      }),
    }).then(res => res.json())
    .then(response => {
      console.log(response)
      onClose()
    }).catch(error => {
      console.error(error)
    })
  }

  return (
    <>
      {showScheduleModal && createPortal(
        <div className='modal'>
          <div className='schedule'>
            <input type="datetime-local" id="start_time" name="start_time" />
            <button className='submit' onClick={scheduleMeeting}>Submit</button>
            <button onClick={onClose}>Close</button>
          </div>
        </div>,
        modalRoot as HTMLElement
      )}
    </>
  );
}

