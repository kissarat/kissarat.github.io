let context

const AudioContext = window.audioContext
    || window.AudioContext
    || window.AudioContext
    || window.webkitAudioContext
    ;

function getAudioContext() {
    return context;
}

function hasAudioContext() {
    return !!getAudioContext()
}

function setAudioContext(newContext = new AudioContext()) {
    if (context) {
        context.close();
    }
    context = newContext;
}

function withAudioContext(cb) {
    setAudioContext();
    cb(context);
}
