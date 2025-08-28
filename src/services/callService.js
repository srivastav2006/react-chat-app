import { db } from './firebase';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  collection,
  addDoc,
  serverTimestamp,
  deleteDoc,
  query,
  where,
  limit,
} from 'firebase/firestore';

// Schema:
// calls/{callId} => {
//   callerId, calleeId, type: 'audio' | 'video', offer, answer, status: 'ringing'|'connected'|'ended', createdAt
// }
// calls/{callId}/candidates => ICE candidates from both sides

export const createCallDocument = async (callId, data) => {
  const callRef = doc(db, 'calls', callId);
  await setDoc(callRef, { ...data, createdAt: serverTimestamp(), status: 'ringing' });
  return callRef;
};

export const updateCallDocument = async (callId, data) => {
  const callRef = doc(db, 'calls', callId);
  await updateDoc(callRef, data);
};

export const getCallDocument = async (callId) => {
  const callRef = doc(db, 'calls', callId);
  return await getDoc(callRef);
};

export const deleteCallDocument = async (callId) => {
  const callRef = doc(db, 'calls', callId);
  await deleteDoc(callRef);
};

export const subscribeToCall = (callId, callback) => {
  const callRef = doc(db, 'calls', callId);
  return onSnapshot(callRef, callback);
};

export const addIceCandidate = async (callId, candidate) => {
  const candidatesRef = collection(db, 'calls', callId, 'candidates');
  await addDoc(candidatesRef, { candidate, createdAt: serverTimestamp() });
};

export const subscribeToCandidates = (callId, callback) => {
  const candidatesRef = collection(db, 'calls', callId, 'candidates');
  return onSnapshot(candidatesRef, callback);
};

export const subscribeToIncomingCalls = (userId, callback) => {
  const q = query(
    collection(db, 'calls'),
    where('calleeId', '==', userId),
    where('status', '==', 'ringing'),
    limit(1)
  );
  return onSnapshot(q, callback);
};


