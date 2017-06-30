import React, {Component} from 'react';
import Message from './Message.jsx';

class MessageList extends Component {
  
  render() {
    const messageList = this.props.messageList;
    return (
      <main className="messages">
        {messageList.map((item, index) => ( 
        <Message key={index} type={item.type} Name={item.username} Message={item.content}/>
        ))}
        
      </main>
    );
  }
}

export default MessageList;

