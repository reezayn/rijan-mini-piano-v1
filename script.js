const audioContext = new AudioContext() 

const NOTE_DETAILS = [
  { note: 'C', key: 'Z', frequency: 261.626, active: false },
  { note: 'Db', key: 'S', frequency: 277.183, active: false },
  { note: 'D', key: 'X', frequency: 293.665, active: false },
  { note: 'Eb', key: 'D', frequency: 311.127, active: false },
  { note: 'E', key: 'C', frequency: 329.628, active: false },
  { note: 'F', key: 'V', frequency: 349.228, active: false },
  { note: 'Gb', key: 'G', frequency: 369.994, active: false },
  { note: 'G', key: 'B', frequency: 391.995, active: false },
  { note: 'Ab', key: 'H', frequency: 415.305, active: false },
  { note: 'A', key: 'N', frequency: 440, active: false },
  { note: 'Bb', key: 'J', frequency: 466.164, active: false },
  { note: 'B', key: 'M', frequency: 493.883, active: false },
]

document.addEventListener('keydown', (e) => {
  if (e.repeat) return  // this is preventing continuous firing of the keydown event when we are pressing down on the keyboard
  const keyCode = e.code // there is a 'code' attribute on the keydown event, we want to assign it to keyCode [for eg: code="KeyC" if C is pressed]
  const noteDetail = getNoteDetails(keyCode) // getNoteDetails is returning the note from NOTE_DETAIL of the key pressed

  if (noteDetail == null) return // this is for conditon where we press key that is not in our NOTE_DETAIL. Here we get noteDetail as undefined if we press any key that is not in the array, but undefined == null is true so it wil work, idk why Kyle used it instead of simply using undefined though
  noteDetail.active = true // when event 'keydown' is fired we want to set noteDetail.active as true
  playNotes()
})
document.addEventListener('keyup', (e) => {
  const keyCode = e.code
  const noteDetail = getNoteDetails(keyCode)

  if (noteDetail == null) return // this is for conditon where we press key that is not in our NOTE_DETAIL.
  noteDetail.active = false // when event 'keyup' is fired we want to set noteDetail.active as false
  playNotes()
})

function getNoteDetails(keyboardKey) { // this function takes in a parameter which is in 'code' attribute format [for eg: 'KeyC' if key C is pressed ] 
  return NOTE_DETAILS.find((n) => `Key${n.key}` === keyboardKey) // here the array NOTE_DETAILS is being searched. Each element is checked as per the code
} // this function returns that note from NOTE_DETAILS which matches the code condition

function playNotes() {
  NOTE_DETAILS.forEach((n) => {
    const keyElement = document.querySelector(`[data-note="${n.note}"]`) // we have a data-note='key' attribute in our HTML file
    keyElement.classList.toggle('activeClass', n.active) //this is toggling on and off our activeClass class of that particular 'n' element when it is active. This class contains CSS, which shows the active class in different color
    if (n.oscillator != null) {
      n.oscillator.stop()
      n.oscillator.disconnect() 
    }// this 'if' block of code basically prevents continuous sounding
  })

  const activeNotes = NOTE_DETAILS.filter(note => note.active) //this returns an array of active notes only
  const gain = 1/activeNotes.length // this gain variable is used for volume gain calculation
  activeNotes.forEach((n) => {
    startNote(n, gain)
  }) //this function is called for each active note
}

function startNote(noteDetails, gain) {
  const gainNode = audioContext.createGain()
  gainNode.gain.value = gain // these 2 lines of code are for volume management
  const oscillator = audioContext.createOscillator()
  oscillator.frequency.value = noteDetails.frequency // here nodeDetails contains 'n' passed from playnote() function which again contains an active note 
  oscillator.type = 'sine' // there are quite a few options here, I liked 'sine' and 'triangle' out of them
  oscillator.connect(gainNode).connect(audioContext.destination)
  oscillator.start()
  noteDetails.oscillator = oscillator // we want to close the oscillator outside of this function but as we know oscillator is an local scope so we pass a reference of osciallator to the ndoeDetails so that we can acccess it from outside the function
}
