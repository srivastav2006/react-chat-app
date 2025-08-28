import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from './useAuth';
import {
  createCallDocument,
  updateCallDocument,
  subscribeToCall,
  addIceCandidate,
  subscribeToCandidates,
  deleteCallDocument,
  subscribeToIncomingCalls,
  getCallDocument,
} from '../services/callService';

const iceServers = [{ urls: ['stun:stun.l.google.com:19302'] }];

export const useCall = () => {
  const { user } = useAuth();
  const [callState, setCallState] = useState({
    callId: null,
    status: 'idle', // idle | ringing | connecting | connected | ended
    type: 'audio',
    remoteUser: null,
    error: null,
  });

  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(new MediaStream());
  const unsubscribeRefs = useRef([]);

  const cleanup = useCallback(async () => {
    unsubscribeRefs.current.forEach((u) => u && u());
    unsubscribeRefs.current = [];
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    setCallState((s) => ({ ...s, status: 'ended', callId: null }));
  }, []);

  const startCall = useCallback(async ({ callId, callee, type = 'audio' }) => {
    try {
      setCallState({ callId, status: 'connecting', type, remoteUser: callee, error: null });
      const constraints = { audio: true, video: type === 'video' };
      const localStream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = localStream;

      const pc = new RTCPeerConnection({ iceServers });
      peerRef.current = pc;
      localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));

      pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((t) => remoteStreamRef.current.addTrack(t));
      };

      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          await addIceCandidate(callId, event.candidate.toJSON());
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      await createCallDocument(callId, {
        callerId: user.uid,
        calleeId: callee.uid,
        type,
        offer,
      });

      const unsubCall = subscribeToCall(callId, async (snap) => {
        const data = snap.data();
        if (!data) return;
        if (data.answer && pc.signalingState !== 'stable') {
          await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
          setCallState((s) => ({ ...s, status: 'connected' }));
        }
        if (data.status === 'ended') {
          await cleanup();
        }
      });

      const unsubCandidates = subscribeToCandidates(callId, async (snap) => {
        snap.docChanges().forEach(async (change) => {
          const { candidate } = change.doc.data();
          if (candidate) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch {}
          }
        });
      });

      unsubscribeRefs.current.push(unsubCall, unsubCandidates);
      setCallState((s) => ({ ...s, status: 'ringing' }));
    } catch (error) {
      setCallState((s) => ({ ...s, error: error.message, status: 'idle' }));
    }
  }, [cleanup, user?.uid]);

  const answerCall = useCallback(async ({ callId, caller, type }) => {
    try {
      setCallState({ callId, status: 'connecting', type, remoteUser: caller, error: null });
      const callSnap = await getCallDocument(callId);
      const data = callSnap.data();
      const constraints = { audio: true, video: type === 'video' };
      const localStream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = localStream;

      const pc = new RTCPeerConnection({ iceServers });
      peerRef.current = pc;
      localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));

      pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((t) => remoteStreamRef.current.addTrack(t));
      };

      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          await addIceCandidate(callId, event.candidate.toJSON());
        }
      };

      await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await updateCallDocument(callId, { answer });

      const unsubCall = subscribeToCall(callId, async (snap) => {
        const d = snap.data();
        if (!d) return;
        if (d.status === 'ended') {
          await cleanup();
        }
      });
      const unsubCandidates = subscribeToCandidates(callId, async (snap) => {
        snap.docChanges().forEach(async (change) => {
          const { candidate } = change.doc.data();
          if (candidate) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch {}
          }
        });
      });
      unsubscribeRefs.current.push(unsubCall, unsubCandidates);
      setCallState((s) => ({ ...s, status: 'connected' }));
    } catch (error) {
      setCallState((s) => ({ ...s, error: error.message, status: 'idle' }));
    }
  }, [cleanup]);

  const endCall = useCallback(async () => {
    if (callState.callId) {
      try { await updateCallDocument(callState.callId, { status: 'ended' }); } catch {}
      try { await deleteCallDocument(callState.callId); } catch {}
    }
    await cleanup();
  }, [callState.callId, cleanup]);

  // Incoming call listener
  useEffect(() => {
    if (!user?.uid || callState.status !== 'idle') return;
    const unsub = subscribeToIncomingCalls(user.uid, (snap) => {
      snap.docChanges().forEach((change) => {
        const data = change.doc.data();
        if (!data) return;
        setCallState({
          callId: change.doc.id,
          status: 'ringing',
          type: data.type,
          remoteUser: { uid: data.callerId },
          error: null,
        });
      });
    });
    return () => unsub && unsub();
  }, [user?.uid, callState.status]);

  const getLocalStream = useCallback(() => localStreamRef.current, []);
  const getRemoteStream = useCallback(() => remoteStreamRef.current, []);

  return {
    callState,
    startCall,
    answerCall,
    endCall,
    getLocalStream,
    getRemoteStream,
  };
};


