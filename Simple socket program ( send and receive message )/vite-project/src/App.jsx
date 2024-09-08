import './App.css'
import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      sayToServer: '',
      messages: [],
      endpoint: 'http://localhost:9000'
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    this.socket = socketIOClient(endpoint);

    this.socket.on('new-message', (message) => {
      this.setState((prevState) => ({
        messages: [...prevState.messages, message]
      }));
    });
  }

  componentWillUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  sendMessage = (e) => {
    e.preventDefault();
    const { input } = this.state;
    if (input.trim()) {
      this.socket.emit('sent-message', input);
      console.log('Message sent:', input);
      this.setState({ input: '' });
    }
  };

  handleInputChange = (e) => {
    this.setState({ input: e.target.value });
  };

  handleSaysToServer = (e) => {
    this.setState({ sayToServer: e.target.value });
  }

  removeThis = (e) => {
    const {} = this.state;
    this.setState({ messages: [] });
  };

  sayHello = (e) => {
    e.preventDefault();
    const {sayToServer} = this.state;
    if(sayToServer.trim()){
      this.socket.emit('say-hello',sayToServer);
      console.log( sayToServer,' is sent to server.');
      this.setState({ sayToServer: '' });
    }
  }

  render() {
    const { input, messages, sayToServer} = this.state;

    return (
      <div>
        <form onSubmit={this.sendMessage}>
          <input
            type="text"
            value={input}
            onChange={this.handleInputChange}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
        <button onClick={() => this.socket.disconnect()}>Disconnect</button>
        <button onClick={() => this.socket.connect()}>Connect</button>
        <div>
          <h2>Messages:</h2>
          <ul>{messages.map((msg, index) => (<li key={index}>{msg}</li>))}</ul>
        </div>
        <button onClick={this.removeThis}>Remove</button>
        <div><br></br></div>
        <div>
          <form onSubmit={this.sayHello}>
          <input
            type="text"
            value={sayToServer}
            onChange={this.handleSaysToServer}
            placeholder="Say to server..."
          ></input>
          <button type='submit'>Say To Server.</button>
          </form>
        </div>
        
      </div>
    );
  }
}

export default App;