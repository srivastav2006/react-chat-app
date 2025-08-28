import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { Header } from './components/Layout/Header';
import { UserList } from './components/Chat/UserList';
import { ChatRoom } from './components/Chat/ChatRoom';
import { CallModal } from './components/Call/CallModal';
import { useCall } from './hooks/useCall';
import './styles/globals.css';

function App() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatId, setChatId] = useState(null);
  const {
    callState,
    startCall,
    answerCall,
    endCall,
    getLocalStream,
    getRemoteStream,
  } = useCall();

  const handleUserSelect = (user, newChatId) => {
    setSelectedUser(user);
    setChatId(newChatId);
  };

  return (
    <Router>
      <div className="App min-h-screen bg-slate-50">
        <ProtectedRoute>
          <div className="h-screen flex flex-col">
            <Header />
            <div className="flex-1 flex overflow-hidden">
              <UserList 
                onUserSelect={handleUserSelect}
                selectedUserId={selectedUser?.uid}
              />
              <ChatRoom 
                selectedUser={selectedUser} 
                chatId={chatId}
                onStartAudioCall={(callee) => callee && startCall({ callId: chatId, callee, type: 'audio' })}
                onStartVideoCall={(callee) => callee && startCall({ callId: chatId, callee, type: 'video' })}
              />
            </div>
          </div>
        </ProtectedRoute>
        <CallModal
          open={!!callState.callId && callState.status !== 'ended'}
          type={callState.type}
          remoteUser={callState.remoteUser}
          status={callState.status}
          onAccept={() => callState.callId && answerCall({ callId: callState.callId, caller: callState.remoteUser, type: callState.type })}
          onReject={endCall}
          onEnd={endCall}
          getLocalStream={getLocalStream}
          getRemoteStream={getRemoteStream}
        />
      </div>
    </Router>
  );
}

export default App;
