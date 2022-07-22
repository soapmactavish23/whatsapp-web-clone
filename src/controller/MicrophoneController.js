import { ClassEvent } from "../util/ClassEvent";

export class MicrophoneController extends ClassEvent {

    constructor() {

        super();

        this._available = false;

        this._mimeType = 'audio/webm';

        navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(stream => {

            this._available = true;

            this._stream = stream;

            this.trigger('ready', this._stream);

        }).catch(error => {
            console.error(error);
        });
    }

    isAvailable() {
        return this._available;
    }

    stop() {
        this._stream.getTracks().forEach(track => {
            track.stop();
        });
    }

    startRecorder() {

        if (this.isAvailable()) {

            this._mediaRecorder = new MediaRecorder(this._stream, {
                mimeType: this._mimeType,
            });

            this._recordedChunks = [];

            this._mediaRecorder.addEventListener('dataavailable', e => {

                if (e.data.size > 0) {
                    this._recordedChunks.push(e.data);
                }

            });

            this._mediaRecorder.addEventListener('stop', e => {

                let blob = new Blob(this._recordedChunks, { type: 'audio/webm', });

                let filename = `rec${Date.now()}.webm`;

                let audioContext = new AudioContext();

                let reader = new FileReader();

                reader.onload = () => {

                    audioContext.decodeAudioData(reader.result).then(decode => {

                        let file = new File([blob], filename, {
                            type: 'audio/webm',
                            lastModified: Date.now(),
                        });

                        this.trigger('recorded', file, decode);

                    });

                }

                reader.readAsArrayBuffer(blob);

            });

            this._mediaRecorder.start();
            this.startTimer();

        }

    }

    stopRecorder() {

        if(this.isAvailable()) {
            this._mediaRecorder.stop();
            this.stop();
            this.stopTimer();
        }

    }

    startTimer() {

        let start = Date.now();

        this._recordMicrophoneInterval = setInterval(() => {

            this.trigger("recordtimer", (Date.now() - start));

        }, 100);

    }

    stopTimer() {
        clearInterval(this._recordMicrophoneInterval);
    }

}