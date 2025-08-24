import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { Header } from './components/Layout/Header';
import { UserList } from './components/Chat/UserList';
import { ChatRoom } from './components/Chat/ChatRoom';
import './styles/globals.css';
import FirebaseTest from './components/FirebaseTest';

function App() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatId, setChatId] = useState(null);

  const handleUserSelect = (user, newChatId) => {
    setSelectedUser(user);
    setChatId(newChatId);
  };

  return (
    <Router>
      <div className="App">
        <ProtectedRoute>
          <div className="h-screen flex flex-col">
            <Header />
            <div className="flex-1 flex">
              <UserList 
                onUserSelect={handleUserSelect}
                selectedUserId={selectedUser?.uid}
              />
              <ChatRoom selectedUser={selectedUser} chatId={chatId} />
            </div>
          </div>
        </ProtectedRoute>
      </div>
    </Router>
  );
}

export default App;
