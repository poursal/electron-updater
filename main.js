// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const log = require('electron-log')
const {autoUpdater} = require('electron-updater')

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
log.info('App starting...')

function sendStatusToWindow(text) {
  log.info(text)
  mainWindow.webContents.send('message', text)
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let updatePending = false

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  setTimeout(function () {
    autoUpdater.checkForUpdatesAndNotify()
    mainWindow.webContents.send('version', app.getVersion())
  }, 3000)

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  //if ( updatePending ) {
  //  autoUpdater.quitAndInstall()
  //  return
  //}

  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...')
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.')
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.')
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err)
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')'
  sendStatusToWindow(log_message)
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded')
  //updatePending = true

  //autoUpdater.quitAndInstall()
  // Show message and wait for feedback
  //if ( install immediate ) {
  //  updatePending = false
  //}
})
