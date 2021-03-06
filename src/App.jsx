import React, { Component } from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.socket = this.createSocket()
    this.state = {
      currentUser: { name: 'Anonymous' }, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [],
      usercount: 0
    }
    this.newMessage = this.newMessage.bind(this);
    this.updateUserName = this.updateUserName.bind(this);
  }

  createSocket() {
    //connet with web socket and take information from server
    let socket = new WebSocket('ws://localhost:3001/');
    socket.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      switch (newMessage.type) {
        case 'incomingMessage':
        case 'incomingNotification':
          // handle incoming message
          var messages = this.state.messages.concat(newMessage);
          this.setState({ messages: messages });
          break;
        case 'incomingUser':
          //handle incomingUser
          this.setState({ usercount: newMessage.count });
          break;
        default:
          // show an error in the console if the message type is unknown
          throw new Error('Unknown event type ' + newMessage.type);
      }
    }
    return socket;
  }
  updateUserName(name) {
    //update User Name and give a postNotification to the server
    const previousUserName = this.state.currentUser.name;
    this.setState({ currentUser: { name: name } });
    const newUserName = { username: name, type: 'postNotification', content: `${previousUserName} has changed their name to ${name}` }
    this.socket.send(JSON.stringify(newUserName));
  }

  newMessage(content) {
    // Add a new message to the list of messages in the data store
    const newMessage = { type: 'postMessage', username: this.state.currentUser.name, content: content };
    this.socket.send(JSON.stringify(newMessage));
  }

  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
          <div className="userCount">{this.state.usercount} Users Online</div>
        </nav>
        <MessageList messageList={this.state.messages}
        />
        <ChatBar userName={this.state.currentUser.name}
          newMessage={this.newMessage}
          updateUserName={this.updateUserName}
        />
      </div>
    );
  }
}
export default App;