import { Component } from '@angular/core';
import { WebRTCService } from './services/webrtc.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  public localStream: MediaStream | null = null;
  public remoteStream: MediaStream | null = null;

  constructor(private webRTCService: WebRTCService) {}
ngOnInit() {
  this.webRTCService.remoteStream$.subscribe(stream => {
    this.remoteStream = stream;
    const remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;
    if (remoteVideo) {
      remoteVideo.srcObject = stream;
    }
  });
}



async startCall() {
  this.localStream = await this.webRTCService.initLocalStream();

  // Attach local stream explicitly (important for mobile Chrome)
  const localVideo = document.getElementById('localVideo') as HTMLVideoElement;
  if (localVideo && this.localStream) {
    localVideo.srcObject = this.localStream;
    localVideo.muted = true; // prevents echo, allows autoplay
  }

  await this.webRTCService.createOffer();

  // Subscribe to remote stream
  this.webRTCService.remoteStream$.subscribe(stream => {
    this.remoteStream = stream;
    const remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;
    if (remoteVideo) {
      remoteVideo.srcObject = stream;
    }
  });
}

}