import React, { useCallback, useEffect } from 'react'
import { ZoomMtg } from '@zoom/meetingsdk'
import { useLocation, useNavigate } from 'react-router'

const payload = {
  sdkKey: 'GENERAL-APP-KEY',
  leaveUrl: '/',
}

export const StartMeeting: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const queryParams = new URLSearchParams(location.search);
  const meetingNumber = queryParams.get('mn') || '';
  const password = queryParams.get('pwd') || '';
  const role = queryParams.get('role') || '0';
  const email = queryParams.get('email') || '';
  const zak = queryParams.get('zak') || undefined;

  const startMeeting = useCallback((signature: string) => {
    const root = document.getElementById('zmmtg-root')
    root && (root.style.display = 'block')

    const params:{
      signature: string;
      meetingNumber: string;
      sdkKey: string;
      userName: string;
      passWord: string;
      userEmail: string;
      zak?: string; 
    } = {
      signature,
      meetingNumber,
      sdkKey: payload.sdkKey,
      userName: email,
      passWord: password,
      userEmail: email,
    }

    if(zak) {
      params.zak = zak
    }

    ZoomMtg.init({
      leaveUrl: payload.leaveUrl,
      patchJsMedia: true,
      isSupportAV: true,
      // debug: true,
      success: () => {
        ZoomMtg.join({
          signature,
          meetingNumber,
          sdkKey: payload.sdkKey,
          userName: email,
          passWord: password,
          userEmail: email,
          zak,
          success: () => {
            console.log('--Joined--')
          },
          error: (err:any) => console.log('--Error--', err)
        })
      },
      error: (err:any)=>{
        console.log(err)
      }
    })
  },[email, meetingNumber, password, zak])

  const getSignature = useCallback(() => {
    fetch('http://localhost:4000/generate-zoom-signature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meetingNumber: meetingNumber,
        role: parseInt(role, 10),
      })
    }).then(res => res.json())
    .then(response => {
      startMeeting(response.signature)
    }).catch(error => {
      console.error(error)
    })
  },[meetingNumber, role, startMeeting])

  useEffect(() => {

    if(!meetingNumber || !email) {
      navigate('/')
      return
    }

    // ZoomMtg.setZoomJSLib('https://source.zoom.us/2.18.2/lib', '/av');
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareWebSDK();
    
    getSignature();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, getSignature, meetingNumber])

  return (
    <></>
  )
}
