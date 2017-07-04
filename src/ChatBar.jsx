import React, {Component} from 'react';

class ChatBar extends Component {
  chatBarMessage(event) {
    //send the message when we press the enter
    if(event.key === 'Enter') {
      this.props.newMessage(event.target.value);
      event.target.value = "";
    }
  }

  newUserName(event) {
    if(event.key === 'Enter') {
      this.props.updateUserName(event.target.value);
    }
  }

  render() {
    return (
      <footer className="chatbar">
        <input className="chatbar-username" onKeyUp={this.newUserName.bind(this)} defaultValue={this.props.userName} />
        <input id="chatBarMessage" onKeyUp={this.chatBarMessage.bind(this)} className="chatbar-message" placeholder="Type a message and hit ENTER" />
      </footer>
    );
  }
}

export default ChatBar;