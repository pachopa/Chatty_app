import React, {Component} from 'react';

class Message extends Component {
  render() {
    const color = this.props.color;
    return (
      <div>
        {(() => {
          switch (this.props.type) {
            case 'incomingNotification':   
              return <div className="message system">
                      <span>{this.props.message}</span>
                     </div>;
            default:      
              return <div className="message">
                        <span className="message-username" style={{color: color}}>{this.props.name}</span>
                        <span className="message-content">{this.props.message}</span>
                      </div>;
          }
        })()}
      </div>
    );
  }
}
export default Message;

