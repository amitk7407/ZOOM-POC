import React, { useState } from 'react';
import { createPortal } from 'react-dom';

interface CreateMeetingModalProps {
  showCreateModal: boolean;
  onClose: () => void;
}

const modalRoot = document.getElementById('modal-root');

export const CreateMeetingModal: React.FC<CreateMeetingModalProps> = ({
  showCreateModal,
  onClose
}) => {
  const [topic, setTopic] = useState<string>('');

  const createMeeting = () => {
    fetch('http://localhost:4000/create-meeting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        invitees: [
          'amit.jnit1@gmail.com',
          'mohit.kumar@arbolus.com',
          'amit.kumar@arbolus.com'
        ],
        topic
      })
    })
      .then(res => res.json())
      .then(response => {
        console.log(response.start_url);
        let queryString = response.start_url.split('?')[1];
        queryString = queryString ? queryString.split('#')[0] : '';
        const arr = queryString.split('&');
        console.log(arr.length);
        let zakCode = '';
        arr.forEach((element: string) => {
          const param = element.split('=');
          zakCode = param[0] === 'zak' ? param[1] : '';
        });

        window.open(
          `http://localhost:3002/meeting?mn=${response.id}&email=amit.kumar@arbolus.com&role=1&pwd=${response.password}&zak=${zakCode}`,
          '_blank'
        );
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <>
    {showCreateModal && createPortal(
      <div className="modal">
        <div className="form-container">
          <div className='imgContainer'>
              <img src='/logo-connect.svg' alt='arbolus' />
              <label>Arbolus Connect</label>
            </div>
            <form onSubmit={createMeeting}>
            <label>
              Meeting Topic:
              <input
                type="text"
                value={topic}
                name="topic"
                onChange={(e) => setTopic(e.target.value)}
              />
            </label>
              <input type='submit' value='Create Meeting' />
            </form>
          <button onClick={onClose}>Close</button>
        </div>
      </div>,
      modalRoot as HTMLElement
    )}
  </>
  );
};
