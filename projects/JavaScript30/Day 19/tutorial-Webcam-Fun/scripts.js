// because of security reason*, app needs a server
    // * webcam can't be loaded without https or localhost

const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// get video piped into the video element
function getVideo() {
    // getUserMedia() returns Promise
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(localMediaStream => {
            console.log(localMediaStream);
            // localMediaStream should be in a form of URL to make video work
                // URL-form localMediaStream can be checked at video tag's src attribute
            video.src = window.URL.createObjectURL(localMediaStream);
            // without play(), only snapshots of the video are shown
            video.play();
        })
        .catch(err => {
            console.error(`OH NO!`, err);
        });
}

// make webcam image bigger and look like video
function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    // take webcam images into canvas by every 16ms (about 60 fps)
        // returning it makes it re-accessible when it has to be stopped
    return setInterval(() => {
        // draw image of 'video' from top-left corner of canvas
        ctx.drawImage(video, 0, 0, width, height);
    }, 16);
}

// take photo and create download link for it
function takePhoto() {
    // play 'snap' sound
    snap.currentTime = 0;
    snap.play();

    // take data out of canvas
        // data is a form of Base64, information of image in a text form
    const data = canvas.toDataURL('image/jpeg');

    // create download link for the image
    const link = document.createElement('a');
    link.href = data;

    // shows thumbnail of image rather than textContent
    link.innerHTML = `<img src="${data}" alt="Selfie" />`;
    link.textContent = "Download Image";

    // downloaded file's name will be 'whataface'
    link.setAttribute('download', 'whataface');

    // insert 'link' as a first child of 'strip'
    strip.insertBefore(link, strip.firstChild);
}

getVideo();

// when video is played, video emits 'canplay' event
// here, 'canplay' event is emitted when webcam is turned on
video.addEventListener('canplay', paintToCanvas);