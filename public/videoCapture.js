/* global MediaRecorder $ */
/*eslint no-console: 0*/

const record = document.getElementById('record')
const btnStop = document.getElementById('stop')
const mute = document.getElementById('mute')
const unmute = document.getElementById('unmute')
const vid = document.getElementById("video")
const audiosts = document.getElementById("audiosts")
ul = document.getElementById('ul');

if (!navigator.mediaDevices){
  alert('getUserMedia support required to use this page')
}

const chunks = []
let videoSize = 0;
let onDataAvailable = (e) => {
  chunks.push(e.data)
  console.log('recording...', formatBytes(chunks[0].size))
}
let audio = true
const options = {
    audioBitsPerSecond : 128000,
    videoBitsPerSecond : 2500000,
    mimeType: 'video/webm'
  }
// Not showing vendor prefixes.
navigator.mediaDevices.getUserMedia({
  audio: audio,
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
  mute.onclick = (e) => {
    vid.muted = true;
    audio = false
    console.log('video muteed')
    mute.disabled=true
    unmute.disabled=false
    unmute.style ="display:inline"
    mute.style ="display:none"
    audiosts.innerHTML = "Audio muted";
  }

  unmute.onclick = (e) => {
    vid.muted = false
    audio = true
    console.log('video unmuteed')
    unmute.disabled=true
    mute.disabled=false
    mute.style ="display:inline"
    unmute.style ="display:none"
    audiosts.innerHTML = "";
  }

  record.onclick = () => {
    recorder.start()
    document.getElementById('status').innerHTML = 'recorder started'
    console.log('recorder started')
    document.getElementById('size').innerHTML = '';
    record.style ="display:none"
    btnStop.style ="display:inline"
    record.disabled=true
    btnStop.disabled=false
  }

  btnStop.onclick = ()=> {
    /* recorder.ondataavailable = e => {
      ul.style.display = 'block';
      const a = document.createElement('a'),
        li = document.createElement('li');
      a.download = ['video_', (new Date() + '').slice(4, 28), '.webm'].join('');
      a.href = URL.createObjectURL(e.data);
      a.textContent = a.download;
      li.appendChild(a);
      ul.appendChild(li);
   }; */
    recorder.stop() 
    document.getElementById('status').innerHTML = 'recorder stopped'; 
    console.log('recorder stopped')
    record.style ="display:inline"
    btnStop.style ="display:none"
    record.disabled=false
    btnStop.disabled=true
    
  }
  
  video.onloadedmetadata = (e) => {
    console.log('onloadedmetadata', e)
  }

  recorder.onstop = (e) => {
    //console.log('e', e)
    console.log('chunks', chunks)
    
    videoSize = formatBytes(chunks[0].size)
    document.getElementById('size').innerHTML = 'Video Size: <b> '+videoSize+'</b>';
    const bigVideoBlob = new Blob(chunks, { 'type' : 'video/webm; codecs=webm' })
    let fd = new FormData()
    fd.append('fname', 'test.webm')
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