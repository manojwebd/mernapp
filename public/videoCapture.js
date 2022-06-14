/* global MediaRecorder $ */
/*eslint no-console: 0*/

const record = document.getElementById('record')
const stop = document.getElementById('stop')

if (!navigator.mediaDevices){
  alert('getUserMedia support required to use this page')
}

const chunks = []
let videoSize = 0;
let onDataAvailable = (e) => {
  chunks.push(e.data)
  console.log('recording...', formatBytes(chunks[0].size))
}
const options = {
    audioBitsPerSecond : 128000,
    videoBitsPerSecond : 2500000 
  }
// Not showing vendor prefixes.
navigator.mediaDevices.getUserMedia({
  audio: true,
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 }
  }
}).then((mediaStream) => {
  
  const recorder = new MediaRecorder(mediaStream,options)
  console.log('recorder', recorder);
  recorder.ondataavailable = onDataAvailable
  const video = document.querySelector('video')
  //const url = window.URL.createObjectURL(mediaStream)
  try {
    video.srcObject = mediaStream;
  } catch (error) {
    video.src = URL.createObjectURL(mediaStream);
  }
  //video.play()

  /* const mediaStreams = new MediaStream();
  const video = document.getElementById('video');
  video.srcObject = mediaStreams; */


  record.onclick = () => {
    recorder.start()
    document.getElementById('status').innerHTML = 'recorder started'
    console.log(recorder.state)
    console.log('recorder started')
    document.getElementById('size').innerHTML = '';
  }

  stop.onclick = ()=> {
    recorder.stop()
    console.log(recorder.state)
    document.getElementById('status').innerHTML = 'recorder stopped'; 
    console.log('recorder stopped')
  }

  video.onloadedmetadata = (e) => {
    console.log('onloadedmetadata', e)
  }

  recorder.onstop = (e) => {
    console.log('e', e)
    console.log('chunks', chunks)
    videoSize = formatBytes(chunks[0].size)
    document.getElementById('size').innerHTML = 'Video Size: <b> '+videoSize+'</b>';
    const bigVideoBlob = new Blob(chunks, { 'type' : 'video/mp4; codecs=mp4' })
    let fd = new FormData()
    fd.append('fname', 'test.mp4')
    fd.append('fileToUpload', bigVideoBlob)
    $.ajax({
      type: 'POST',
      url: '/profile2',
      data: fd,
      processData: false,
      contentType: false
    }).done(function(data) {
      console.log('post video to server',data)
    })
  }
}).catch(function(err){
  console.log('error', err)
})

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}