export class CameraController {

    constructor(videoEl) {
        this._videoEl = videoEl;

        navigator.mediaDevices.getUserMedia({
            video: true
        }).then(stream => {

            this._videoEl.src = URL.createObjectURL(stream);
            this._videlEl.play();

        }).catch(error => {
            console.error(error);
        });
    }

}