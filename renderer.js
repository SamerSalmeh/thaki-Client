// This file is required by the index.html file and will
// be executed in the renderer process for that window.

const { ipcRenderer } = require("electron");
var fs = require('fs');

// function to delete the file from JSON file and from user device 
export const deleteFile = function (path) {
    //delete the file from device using the path of the file
    fs.unlink(path, (err) => {
        console.log("delete",path)
        if (err){
             throw err;
        } else {
            //if is deleting file from device have been success do that :
            console.log(path + ' was deleted');
            // delete the file object from JSON file by Overwriting it
            fs.readFile('data.json', 'utf8', function readFileCallback(err, data) {
                if (err) {
                    throw err;
                } else {
                    //convert to an object
                    var obj = JSON.parse(data); 

                    //find it and remove from it
                    obj.app.some(function (el) {
                        if (el.path === path) {
                            obj.app.splice(obj.app.indexOf(el), 1); 
                        }
                    });

                    //convert it back to json
                    var json = JSON.stringify(obj, null, 4); 

                    // write it back 
                    fs.writeFile('data.json', json, 'utf8', function (err) {
                        if (err) throw err;
                        console.log('complete');
                    }); 
                }
            });
        }
    });
}

// function to download the file from server by url of file
export const download = function (url) {
    console.log("conecte");
    //send to main.js the url and the directory using key "download"
    ipcRenderer.send("download", {
        url,
        properties: {
            // give user the choice to select directory
            /*saveAs: true,*/

            // select default directory
             directory: "./react-client/app/"
        }
    });

    /*ipcRenderer.on("download progress", (event, progress) => {
        console.log("progress", progress); // Progress in fraction, between 0 and 1
        const progressInPercentages = progress * 100; // With decimal point and a bunch of numbers
        const cleanProgressInPercentages = Math.floor(progress * 100); // Without decimal point
    });*/

    //receive the path of the file in user device and store it in JSON file
    ipcRenderer.on("download complete", (event, file) => {
        // create new object to store the new data of the file
        var newApp = {
            "name": file.replace(/^.*[\\\/]/, '').slice(0, -4),
            "image": '../../react-client/app/' + file.replace(/^.*[\\\/]/, ''),
            "path": './react-client/app/' + file.replace(/^.*[\\\/]/, ''),
        }
        //make a default Icon for vedios
        if (file.slice(-3) === 'mp4') {
            newApp.image = "../../react-client/src/image/video.png";
            // //make a default Icon for text
        } else if (file.slice(-3) === 'txt') {
            newApp.image = "../../react-client/src/image/text.png";
        }
        //Overwrite the JSON file to add on it
        fs.readFile('data.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
                throw err;
            } else {
                var obj = JSON.parse(data); 
                obj.app.push(newApp);
                var json = JSON.stringify(obj, null, 4); 
                fs.writeFile('data.json', json, 'utf8', function (err) {
                    if (err) throw err;
                }); 
            }
        });
    });
}