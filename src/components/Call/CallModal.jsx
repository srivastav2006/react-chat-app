import { useEffect, useRef } from 'react';
import { Button } from '../UI/Button';
import { Phone, PhoneOff } from 'lucide-react';
import { Avatar } from '../UI/Avatar';

export const CallModal = ({
  open,
  type = 'audio',
  remoteUser,
  status,
  onAccept,
  onReject,
  onEnd,
  getLocalStream,
  getRemoteStream,
}) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const localStream = getLocalStream && getLocalStream();
    const remoteStream = getRemoteStream && getRemoteStream();
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [open, getLocalStream, getRemoteStream]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar src={remoteUser?.photoURL} alt={remoteUser?.displayName} size="lg" />
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{remoteUser?.displayName}</h3>
            <p className="text-sm text-slate-500 capitalize">{status} • {type} call</p>
          </div>
        </div>

        {type === 'video' ? (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full rounded-xl bg-black aspect-video" />
            <video ref={localVideoRef} autoPlay muted playsInline className="w-full rounded-xl bg-black aspect-video" />
          </div>
        ) : (
          <div className="mb-4 text-center text-slate-600">Audio call in progress...</div>
        )}

        <div className="flex items-center justify-center gap-3">
          {status === 'ringing' && onAccept && (
            <Button onClick={onAccept} className="bg-green-600 hover:bg-green-700">
              <Phone className="w-4 h-4" /> Accept
            </Button>
          )}
          {status === 'ringing' && onReject && (
            <Button variant="danger" onClick={onReject}>
              <PhoneOff className="w-4 h-4" /> Reject
            </Button>
          )}

          {(status === 'connected' || status === 'connecting') && (
            <Button variant="danger" onClick={onEnd}>
              <PhoneOff className="w-4 h-4" /> End
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};


