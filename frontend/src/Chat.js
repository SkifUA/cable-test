import React, { Component } from 'react'
import ActionCable from 'action-cable-react-jwt'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'

const URL = 'ws://localhost:3030'

class Chat extends Component {
  state = {
    name: 'Bob',
    messages: [],
  }
  // token = "nVzZXJfaWQiOjEwLCJ1aWQiOiIzNzQ3ZDQ0MS01ZTAyLTQwODgtODczZi0wNTBjMTg2MTRmM2IifQ.W7S5yBrczGgp0mvaqp5CK2rHddKcW7s8fcYPedUSumI"
  token = "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1OTQ5MTE4NzQsInVzZXJfaWQiOjYzLCJ1aWQiOiJkYjVmOTY4Ny00MjYwLTRiMzctYWNhYy00MDAzYjU0ZThlOGYifQ.mNZ7ZcT9WXt6FTROUkX2mTnaAb__ecH6Nuc7IuSnZFU"
  // ws = new WebSocket(URL)
  cable = ActionCable.createConsumer("ws://localhost:3000/cable", this.token)
  // cable = ActionCable.createConsumer("wss://....../cable", this.token)


  componentDidMount() {
    this.ws = this.cable.subscriptions.create({channel: "MatchChat", match_id: 1}, {
      connected: () => { console.log("MatchChat: connected") },             // onConnect
      disconnected: () => { console.log("MatchChat: disconnected") },       // onDisconnect
      received: (data) => { console.log("MatchChat received: ", data); }         // OnReceive
    })
    // this.ws.onopen = () => {
    //   // on connecting, do nothing but log it to the console
    //   console.log('connected')
    // }
    //
    // this.ws.onmessage = evt => {
    //   // on receiving a message, add it to the list of messages
    //   const message = JSON.parse(evt.data)
    //   this.addMessage(message)
    // }
    //
    // this.ws.onclose = () => {
    //   console.log('disconnected')
    //   // automatically try to reconnect on connection loss
    //   this.setState({
    //     ws: new WebSocket(URL),
    //   })
    // }
    this.video = this.cable.subscriptions.create({channel: "UploadVideo", user_account_video_id: 46}, {
      connected: () => { console.log("UploadVideo: connected") },             // onConnect
      disconnected: () => { console.log("UploadVideo: disconnected") },       // onDisconnect
      received: (data) => { console.log("UploadVideo received: ", data); }         // OnReceive
    })
    this.image = this.cable.subscriptions.create({channel: "UploadImage", user_account_image_id: 87}, {
      connected: function() { console.log("cable: connected") },             // onConnect
      disconnected: function() { console.log("cable: disconnected") },       // onDisconnect
      received: (data) => { console.log("cable received: ", data); }         // OnReceive
    })
  }

  addMessage = message =>
    this.setState(state => ({ messages: [message, ...state.messages] }))

  submitMessage = messageString => {
    // on submitting the ChatInput form, send the message, add it to the list and reset the input
    const message = { name: this.state.name, message: messageString }
    this.ws.send(JSON.stringify(message))
    this.addMessage(message)
  }

  render() {
    return (
      <div>
        <label htmlFor="name">
          Name:&nbsp;
          <input
            type="text"
            id={'name'}
            placeholder={'Enter your name...'}
            value={this.state.name}
            onChange={e => this.setState({ name: e.target.value })}
          />
        </label>
        <ChatInput
          ws={this.ws}
          video={this.video}
          image={this.image}
          onSubmitMessage={messageString => this.submitMessage(messageString)}
        />
        {this.state.messages.map((message, index) =>
          <ChatMessage
            key={index}
            message={message.message}
            name={message.name}
          />,
        )}
      </div>
    )
  }
}

export default Chat
