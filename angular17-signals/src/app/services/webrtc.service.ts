import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebRTCService {
  private peer: RTCPeerConnection;
  private ws: WebSocket;
  private messageQueue: string[] = [];

  // Expose remote stream via RxJS Subject
  public remoteStream$ = new Subject<MediaStream>();

  constructor() {
    this.peer = new RTCPeerConnection();
    this.ws = new WebSocket(environment.signalingServerUrl);

    // Handle WebSocket lifecycle
    this.ws.onopen = () => {
      console.log('WebSocket connection established');
      this.messageQueue.forEach(msg => this.ws.send(msg));
      this.messageQueue = [];
    };

    this.ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      if (data.sdp) {
        await this.peer.setRemoteDescription(new RTCSessionDescription(data.sdp));
        if (data.sdp.type === 'offer') {
          const answer = await this.peer.createAnswer();
          await this.peer.setLocalDescription(answer);
          this.safeSend(JSON.stringify({ sdp: answer }));
        }
      }

      if (data.candidate) {
        await this.peer.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    };

    // Send ICE candidates to signaling server
    this.peer.onicecandidate = (event) => {
      if (event.candidate) {
        this.safeSend(JSON.stringify({ candidate: event.candidate }));
      }
    };

    // Handle remote media
    this.peer.ontrack = (event) => {
      const [stream] = event.streams;
      console.log('Remote stream received', stream);
      this.remoteStream$.next(stream);
    };
  }

  /** Safe send wrapper with queueing */
  private safeSend(message: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      console.warn('WebSocket not open yet, queueing message');
      this.messageQueue.push(message);
    }
  }

  /** Initialize local camera/mic and attach tracks */
async initLocalStream(): Promise<MediaStream> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    stream.getTracks().forEach(track => this.peer.addTrack(track, stream));
    console.log('Local stream acquired', stream);
    return stream;
  } catch (err) {
    console.error('Error accessing media devices:', err);
    throw err;
  }
}

  /** Create and send an SDP offer */
  async createOffer() {
    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(offer);
    this.safeSend(JSON.stringify({ sdp: offer }));
  }

  /** Collect WebRTC stats for monitoring */
  async getStats(): Promise<any[]> {
    if (!this.peer) return [];

    const statsReport = await this.peer.getStats();
    const stats: any[] = [];

    statsReport.forEach(report => {
      if (report.type === 'outbound-rtp' && report.kind === 'video') {
        stats.push({ type: 'bitrate', value: report.bitrateMean || 'N/A' });
        stats.push({ type: 'packetsLost', value: report.packetsLost || 0 });
        stats.push({ type: 'jitter', value: report.jitter || 'N/A' });
      }
      if (report.type === 'inbound-rtp' && report.kind === 'video') {
        stats.push({ type: 'framesReceived', value: report.framesReceived || 0 });
        stats.push({ type: 'framesDropped', value: report.framesDropped || 0 });
      }
      if (report.type === 'inbound-rtp' && report.kind === 'audio') {
        stats.push({ type: 'audioLevel', value: report.audioLevel || 'N/A' });
      }
    });

    return stats;
  }
}