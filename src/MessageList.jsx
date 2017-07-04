import React, {Component} from 'react';
import Message from './Message.jsx';

class MessageList extends Component {
  
  render() {
    const messageList = this.props.messageList;
    return (
      <main className="messages">
        {messageList.map((item, index) => ( 
        <Message key={item.id} color={item.color} type={item.type} name={item.username} message={item.content}/>
        ))}
      </main>
    );
  }
}

export default MessageList;

