import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WebRTCService {
  private peer: RTCPeerConnection;
  private ws: WebSocket;

  constructor() {
    this.peer = new RTCPeerConnection();
    this.ws = new WebSocket('wss://webrtc-angular-signaling.onrender.com');

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.sdp) {
        this.peer.setRemoteDescription(new RTCSessionDescription(data.sdp));
      }
      if (data.candidate) {
        this.peer.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    };

    this.peer.onicecandidate = (event) => {
      if (event.candidate) {
        this.ws.send(JSON.stringify({ candidate: event.candidate }));
      }
    };
  }

  async createOffer() {
    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(offer);
    this.ws.send(JSON.stringify({ sdp: offer }));
  }
}