// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const { download } = require("electron-dl");

let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ icon: './react-client/src/image/thakiLogo.png' })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  mainWindow.maximize()
  // mainWindow.setMenu(null)

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {

    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
var f = ""
var g = ""
app.on('ready', () => {

  createWindow()
  //receive the url and the directory from render.js using key "download" and download the file
  //and resend the path of that file in the user device using key "download complete"
  ipcMain.on("download", (event, info) => {
    f = info.url
    g = info.properties
    // info.properties= function status() {
    // mainWindow.webContents.send("download progress", status);
    // console.log("send")
    // }
    download(BrowserWindow.getFocusedWindow(), info.url, info.properties)
  });
  mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
    // Set the save path, making Electron not to prompt a save dialog.
    console.log("am here")
    item.setSavePath("./react-client/app/")

    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused')
        } else {
          mainWindow.webContents.send("download progress", item.getReceivedBytes());
          //console.log(`Received bytes: ${item.getReceivedBytes()}`)
        }
      }
    })
  })
})


// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// Rename the application (Overwrite)
app.setName("Thaki")

