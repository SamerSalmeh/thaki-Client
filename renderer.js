// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer } = require("electron");
const shell = require('shelljs');
const shellExec = require('shell-exec')
require('shelljs-plugin-open');
// shellExec(['open /Users/rbk27/Desktop/uploadTest.zip'])
// var request = require('../../Library/Caches/typescript/2.9/node_modules/@types/request');
var fs = require('fs');
import axios from "axios"
// var extract = require("extract")


// import { unzip } from 'adm-zip'



export const download = function (urll) {
    console.log("conecte");

    ipcRenderer.send("download", {
        url: urll,
        // url: "http://releases.ubuntu.com/12.04.5/ubuntu-12.04.5-alternate-amd64.iso",
        properties: {
            saveAs: true
            // directory: "Users/rbk27/Desktop/electron-quick-start/app/"
        }
    });

    ipcRenderer.on("download complete", (event, file) => {
        console.log("complete ", file);
        // extract(file, { dir: '/Users/rbk27/Desktop/' }, function (err) {
        //     if (err) {
        //         console.log(err)
        //     }
        //     // extraction is complete. make sure to handle the err
        // })

        // shell.open(file)
        var newApp = {
            "name": file.replace(/^.*[\\\/]/, '').slice(0, -4),
            "image": file,
            "path": file
        }
        if(file.slice(-3)==='mp4'){
            newApp.image="/Users/rbk27/Desktop/thaki-Client/react-client/src/image/video.png"
        }

        fs.readFile('data.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
                throw err;
            } else {
                var obj = JSON.parse(data); //now it an object
                obj.app.push(newApp); //add some data
                var json = JSON.stringify(obj, null, 4); //convert it back to json
                fs.writeFile('data.json', json, 'utf8', function (err) {
                    if (err) throw err;
                    console.log('complete');
                }); // write it back 
            }
        });

        // fs.createReadStream(file)
        //     .pipe(unzip.Parse())
        //     .on('entry', function (entry) {
        //         // var fileName = entry.path;
        //         // var type = entry.type; // 'Directory' or 'File'
        //         // var size = entry.size;
        //         console.log("Hello world", entry)
        //         //   if (fileName) {
        //         //     entry.pipe(fs.createWriteStream('output/path'));
        //         //   } else {
        //         //     entry.autodrain();
        //         //   }
        //     });

    });
    ipcRenderer.on("download progress", (event, progress) => {
        console.log("progress", progress); // Progress in fraction, between 0 and 1
        const progressInPercentages = progress * 100; // With decimal point and a bunch of numbers
        const cleanProgressInPercentages = Math.floor(progress * 100); // Without decimal point
    });
}