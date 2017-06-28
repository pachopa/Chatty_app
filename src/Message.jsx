import React, {Component} from 'react';

class Message extends Component {
  render() {
    return (
      <div>
        <div className="message">
          <span className="message-username">{this.props.Name}</span>
          <span className="message-content">{this.props.Message}</span>
        </div>
      </div>
    );
  }
}

export default Message;

