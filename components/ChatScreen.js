import { Avatar, IconButton } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { auth, db } from '../firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import firebase from 'firebase';
import TimeAgo from 'timeago-react';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import { useRef, useState } from 'react';
import Message from './Message';
import getRecipientEmail from '../utils/getRecipientEmail';

function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef(null);
  const router = useRouter();
  const [messagesSnapshot] = useCollection(
    db
      .collection('chats')
      .doc(router.query.id)
      .collection('messages')
      .orderBy('timestamp', 'asc')
  );

  const [recipientSnapshot] = useCollection(
    db
      .collection('users')
      .where('email', '==', getRecipientEmail(chat.users, user))
  );

  const showMessages = () => {
    console.log('messagesSnapshot', messagesSnapshot);
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => {
        return (
          <Message
            key={message.id}
            user={message.data().user}
            message={{
              ...message.data(),
              timestamp: message.data().timestamp?.toDate().getTime(),
            }}
          />
        );
      });
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };
  const scrollToButtom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: 'smoth',
      block: 'start',
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection('users').doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection('chats').doc(router.query.id).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput('');
    scrollToButtom();
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEamil = getRecipientEmail(chat.users, user);

  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient?.photoURL} />
        ) : (
          <Avatar>{recipientEamil[0]}</Avatar>
        )}

        <HeaderInfomation>
          <h3>{recipientEamil}</h3>
          {recipientSnapshot ? (
            <p>
              Last active:{' '}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datrtime={recipient?.lastSeen?.toDate()} />
              ) : (
                'Unavailable'
              )}
            </p>
          ) : (
            <p>Loading Last active</p>
          )}
        </HeaderInfomation>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessagesRef} />
      </MessageContainer>

      <InputContainer>
        <InsertEmoticonIcon />
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <button hidden disable={!input} type='submit' onClick={sendMessage}>
          Send Message
        </button>
        <MicIcon />
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div``;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  padding: 20px;
  margin-left: 15px;
  margin-right: 15px;
`;

const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInfomation = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
  }

  > p {
    font-size: 14px;
    color: gray;
  }
`;

const HeaderIcons = styled.div``;

const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;

const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;
