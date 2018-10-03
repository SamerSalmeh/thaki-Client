// This file is required by the index.html file and will
// be executed in the renderer process for that window.

const { ipcRenderer } = require("electron");
var fs = require('fs');
const promisify = require('util').promisify;
const readdirP = promisify(fs.readdir);
const statP = promisify(fs.stat);

var shell = require("shelljs");
require("shelljs-plugin-open");

// const { getIconForPath, ICON_SIZE_MEDIUM } = require('system-icon');
  
//   getIconForPath("./react-client/app/English_CD_V1/Some text.text", ICON_SIZE_MEDIUM, (err, result) => {
//     if (err) {
//       console.error(err);
//     } else {
//       writeFileSync("icon.png", result);
//     }
//   });

// var DecompressZip = require('decompress-zip');
// var ZIP_FILE_PATH = "./react-client/app/English_CD_V1.zip";
// var DESTINATION_PATH = "./react-client/app/dd";
// var unzipper = new DecompressZip(ZIP_FILE_PATH);

// // Add the error event listener
// unzipper.on('error', function (err) {
//     console.log('Caught an error', err);
// });

// // Notify when everything is extracted
// unzipper.on('extract', function (log) {
//     console.log('Finished extracting', log);
// });

// // Notify "progress" of the decompressed files
// unzipper.on('progress', function (fileIndex, fileCount) {
//     console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
// });

// // Start extraction of the content
// unzipper.extract({
//     path: DESTINATION_PATH
//     // You can filter the files that you want to unpack using the filter option
//     //filter: function (file) {
//         //console.log(file);
//         //return file.type !== "SymbolicLink";
//     //}
// });

export const openFile = function (path) {

    shell.open(path);
    //if is deleting file from device have been success do that :
    console.log(path + ' was open');
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
                    obj.app[obj.app.indexOf(el)].click++;
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

export const Zero = function () {
    // delete the file object from JSON file by Overwriting it
    fs.readFile('data.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            throw err;
        } else {
            //convert to an object
            var obj = JSON.parse(data);

            for (var i = 0; i < obj.app.lenght; i++) {
                obj.app[i].click = 0;
            }

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

// function to delete the file from JSON file and from user device 
export const deleteFile = function (path) {
    //delete the file from device using the path of the file
    fs.unlink(path, (err) => {
        console.log("delete", path)
        if (err) {
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
// const generateFileTreeObject = directoryString => {
//     return readdirP(directoryString)
//         .then(arrayOfFileNameStrings => {
//             const fileDataPromises = arrayOfFileNameStrings.map(fileNameString => {
//                 const fullPath = `${directoryString}/${fileNameString}`;
//                 return statP(fullPath)
//                     .then(fileData => {
//                         const file = {};
//                         file.filePath = fullPath;
//                         file.isFileBoolean = fileData.isFile();
//                         /*Here is where we'll do our recursive call*/
//                         if (!file.isFileBoolean) {
//                             file.files = generateFileTreeObject(file.filePath)
//                             //     return generateFileTreeObject(file.filePath) 
//                             //         readdirP(fileNamesSubArray)
//                             //       .then(fileNamesSubArray => {
//                             //         file.files = fileNamesSubArray;
//                             //       })
//                             //       .catch(console.error);
//                         }
//                         /*End recursive condition*/
//                         return file;
//                     });
//             });
//             return Promise.all(fileDataPromises);
//         });
// };
// console.log(generateFileTreeObject("./react-client/app/English_CD_V1"))

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

    ipcRenderer.on("download progress", (event, progress) => {
        console.log("progress", progress); // Progress in fraction, between 0 and 1
        // const progressInPercentages = progress * 100; // With decimal point and a bunch of numbers
        // console.log(progressInPercentages)
        const cleanProgressInPercentages = Math.floor(progress * 100); // Without decimal point
        console.log(cleanProgressInPercentages)
    });

    //receive the path of the file in user device and store it in JSON file
    ipcRenderer.on("download complete", (event, file) => {
        // create new object to store the new data of the file
        var newApp = {
            "name": file.replace(/^.*[\\\/]/, '').slice(0, -4),
            "image": '../../react-client/app/' + file.replace(/^.*[\\\/]/, ''),
            "path": './react-client/app/' + file.replace(/^.*[\\\/]/, ''),
            "click": 0,
            "categorie": 'image'
        }
        if(file.slice(-4) === 'html'){
            newApp.image = "../../react-client/src/image/html.png";
            newApp.categorie = "html"
        }
        //make a default Icon for vedios
        else if (file.slice(-3) === 'mp4') {
            newApp.image = "../../react-client/src/image/video.png";
            newApp.categorie = "video"
            // //make a default Icon for text
        } else if (file.slice(-3) === 'txt') {
            newApp.image = "../../react-client/src/image/text.png";
            newApp.categorie = "text"
        }
        else if (file.slice(-3) === 'mp3') {
            newApp.image = "../../react-client/src/image/sound.png";
            newApp.categorie = "sound"
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