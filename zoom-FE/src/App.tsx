import React, { useState } from 'react';

import { JoinMeetingModal } from './JoinMeetingModal';
import { ScheduleMeetingModal } from './ScheduleMeetingModal';

import './App.css';
import { CreateMeetingModal } from './CreateMeetingModal';

export const App: React.FC = () => {

  const [showJoinModal, setShowJoinModal] = useState<boolean>(false);
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [meetingList, setMeetingList] = useState<any[]>([]);
  const [recordingList, setRecordingList] = useState<any[]>([]);

  const listAllMeetings = () => {
    setRecordingList([]);
    fetch('http://localhost:4000/list-meetings', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(response => {
        console.log(response);
        setMeetingList(response.meetings.meetings);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const listAllRecordings = () => {
    setMeetingList([]);
    fetch('http://localhost:4000/list-recordings', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(response => {
        console.log(response);
        setRecordingList(response.recordings.meetings);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const getChat = (meetingId:string) => {
    // setMeetingList([]);
    fetch(`http://localhost:4000/get-chat?meetingId=${meetingId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(response => {
        console.log(response);
        // setRecordingList(response.recordings.meetings);
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <div className='app'>
      <div className='btn-container'>
        <button className='btn btn-primary' onClick={listAllMeetings} >List All Meetings</button>
        <button className='btn btn-primary' onClick={listAllRecordings} >List All Recordings</button>
        <button className='btn btn-danger'  onClick={() => setShowCreateModal(true)}>Create Meeting</button>
        <button className='btn btn-primary' onClick={() => setShowScheduleModal(true)}>Schedule Meeting</button>
        <button className='btn btn-primary' onClick={() => setShowJoinModal(true)}>Join Meeting</button>
      </div>
      <CreateMeetingModal
        showCreateModal={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
      <JoinMeetingModal showJoinModal={showJoinModal} onClose={() => setShowJoinModal(false)} />
      <ScheduleMeetingModal showScheduleModal={showScheduleModal} onClose={() => setShowScheduleModal(false)} />
      {meetingList.map(meeting => (
        <h2 key={meeting.id}>{meeting.topic}</h2>
      ))}
      {recordingList.map(recording => {
        const transcriptFile = recording.recording_files.find(
          (file: any) => file.file_type === 'TRANSCRIPT'
        );
        const videoFile = recording.recording_files.find(
          (file: any) => file.file_type === 'MP4'
        );

        return (
          <div key={recording.id}>
            <h2>{recording.topic}</h2>
            {/* {videoFile?.download_url && (
              <iframe
                width="100%"
                id="videoId"
                height="410"
                src={videoFile?.download_url}
                frameBorder="0"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                sandbox="allow-same-origin allow-scripts allow-forms"
              ></iframe>
            )} */}
            {videoFile?.download_url && (
              <>
                <video controls>
                  <source src={videoFile.download_url} type="video/mp4" />
                  {transcriptFile?.download_url && (
                    <track
                      kind="subtitles"
                      src={transcriptFile.download_url}
                      srcLang="es"
                      label="Spanish"
                    />
                  )}
                </video>
                <button onClick={() => getChat(recording.id)}>Get Chat</button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

