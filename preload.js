// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const {ipcRenderer} = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

// Listen for messages
ipcRenderer.on('message', function(event, text) {
  var container = document.getElementById('messages')
  var message = document.createElement('div')
  message.innerHTML = text
  container.appendChild(message)
})

ipcRenderer.on('version', function(event, text) {
  document.getElementById('version').innerText = text
})
