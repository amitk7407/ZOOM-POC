import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { createPortal } from 'react-dom';

import './App.css';

const modalRoot = document.getElementById('modal-root');

export const JoinMeetingModal: React.FC<{ showJoinModal:boolean; onClose:()=>void; }> = ({ showJoinModal, onClose }) => {
  const navigate = useNavigate()

  const [email, setEmail] = useState<string>('');
  const [meetingNumber, setMeetingNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = () => {
    navigate(`/meeting?mn=${meetingNumber}&email=${email}&role=0&password=${password}`);
  }

  return (
  <>
    {showJoinModal && createPortal(
      <div className="modal">
        <div className="form-container">
          <div className='imgContainer'>
              <img src='/logo-connect.svg' alt='arbolus' />
              <label>Arbolus Connect</label>
            </div>
            <div className='form'>
              <label>
                Email:
                <input
                  type="email"
                  value={email}
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label>
                Meeting Number:
                <input
                  type="text"
                  value={meetingNumber}
                  name="meetingNumber"
                  onChange={(e) => setMeetingNumber(e.target.value)}
                  required
                />
              </label>
              <label>
                Password:
                <input
                  type="text"
                  value={password}
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              <button className='button' onClick={handleSubmit}>Join Meeting</button>
            </div>
          <button onClick={onClose}>Close</button>
        </div>
      </div>,
      modalRoot as HTMLElement
    )}
  </>
  );
}

