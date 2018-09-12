import axios from "axios";
import React, { Component } from "react";
import { DragDropContainer, DropTarget } from "react-drag-drop-container";

import { download, deleteFile } from "../../../renderer";
import style from "./MainScreenStyle.css";

//importing react material ui
import { Grid } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

var shell = require("shelljs");
require("shelljs-plugin-open");
var ds = require("fd-diskspace");

var freeSpace;
// Async
ds.diskSpace(function(err, res) {
  if (err) throw err;
  freeSpace = res.total.free;
  console.log(res.total.free);
});

export default class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serverData: [],
      open: false,
      newdata: [],
      found: false,
      src: "../src/image/trashCan.png",
      spaceUsed: false,
      pathStore: "",
      path: 0,
    };
    this.sendData = this.sendData.bind(this);
    this.open = this.open.bind(this);
    this.dropped = this.dropped.bind(this);
  }

  componentWillMount() {
    // make refresh every two seconds
    setInterval(this.refresh.bind(this), 2000);
  }

  // function to open file in device directly by path
  open(path) {
    shell.open(path);
  }

  //two function to change Trash can Icon
  changeTrashIconOnHover() {
    this.setState({
      src: "../src/image/openTrashCan.png",
    });
  }
  changeTrashIconOnOut() {
    this.setState({
      src: "../src/image/trashCan.png",
    });
  }

  //function to open Dialog after drop file in trash icon
  dropped(path) {
    this.setState({
      pathStore: path,
      open: true,
      src: "../src/image/trashCan.png",
    });
  }

  //this function send the path of file to delete function in render.js to remove it
  delete() {
    deleteFile(this.state.pathStore);
    this.handleClose();
  }

  //this function hold two api ... one to get data from server and one to get data from JSON file
  //and it refreshing every two seconds
  refresh() {
    console.log("refresh");

    // get JSON file date
    axios.get("../../data.json").then(data => {
      this.setState({
        newdata: data.data.app,
      });
    });

    //get server data
    axios
      .get("http://192.168.0.58:3000/api/v1/get/all/objects")
      .then(res => {
        this.setState({
          serverData: res.data,
        });
      })
      .catch(err => {
        console.log("err", err);
      });
  }

  // function to open announcement Dialog about space used
  spaceUsedOpen = () => {
    this.setState({ spaceUsed: true });
  };

  //function to close all Dialogs
  handleClose = () => {
    this.setState({ open: false, spaceUsed: false });
  };

  // function to reqest dawnload path from server
  sendData(key) {
    console.log("connecting to the server .....");
    axios
      .post("http://192.168.0.58:3000/api/v1/get/object", {
        fileName: key,
      })
      .then(res => {
        //get the size of file that user want to download
        const { objectSize } = res.data;

        //if there free space in the user device will download ... if not it will open Dialog
        if (objectSize < freeSpace) {
          download(res.data.url);
        } else {
          this.spaceUsedOpen();
        }
      })
      .catch(err => {
        console.log("err", err);
      });
  }

  render() {
    const serverContent = this.state.serverData.length
      ? this.state.serverData.map((ele, i) => {
          //get the raw name from server
          var data = ele.Key.replace(/^.*[\\\/]/, "").slice(0, -4);

          //check if the file exist or not
          var found = false;

          this.state.newdata.map((dataEle, index) => {
            if (data === dataEle.name) {
              found = true;
            }
          });

          if (found === false) {
            return (
              <button
                className={style.new}
                key={i}
                onClick={() => this.sendData(ele.Key)}
              >
                {data}
              </button>
            );
          }
        })
      : "fetching data ...";

    const installedApp = this.state.newdata.length
      ? this.state.newdata.map((ele, i) => {
          return (
            <DragDropContainer
              onDrop={() => this.dropped(ele.path)}
              targetKey="delete"
              key={i}
            >
              <Grid className={style.app} item xs={2}>
                <img
                  onClick={() => this.open(ele.path)}
                  className={style.icon}
                  src={ele.image}
                />
                <br />
                {ele.name}
              </Grid>
            </DragDropContainer>
          );
        })
      : "empty";
    return (
      <div className={style.main}>
        <div className={style.serverContent}>{serverContent}</div>
        <div className={style.head}>
          <Grid className={style.header} container spacing={24}>
            <Grid item xs={4}>
              {/*<div className={style.search}>
      <input
      className={style.SearchInput}
      type="text"
      placeholder="Search ..."
      />
      <a href="#">
      <div className={style.SearchIcon} />
      </a>
      </div>
    */}{" "}
            </Grid>
            <Grid item xs={4} />
            <Grid item xs={4}>
              {/* <button className={style.filter}>
    <div className={style.FilterIcon}></div>
  </button> */}
            </Grid>
          </Grid>
        </div>
        <div>
          <Grid className={style.apps} container spacing={24}>
            {installedApp}
          </Grid>
        </div>
        <div className={style.footer}>
          <Grid className={style.foot} container spacing={24}>
            <Grid item xs={3}>
              {/* <a href="">
  <img src="../src/image/home.png" />
</a>*/}
            </Grid>
            <Grid item xs={3}>
              {/*<a href="">
<img src="../src/image/fav.png" />
</a>*/}
            </Grid>
            <Grid item xs={3}>
              {/* <a href="#" onClick={this.refresh.bind(this)}>
                                <img src="../src/image/update.png" />
                            </a>*/}
            </Grid>
            <Grid item xs={3}>
              <DropTarget
                targetKey="delete"
                onDragEnter={this.changeTrashIconOnHover.bind(this)}
                onDragLeave={this.changeTrashIconOnOut.bind(this)}
              >
                <img src={this.state.src} />
              </DropTarget>
            </Grid>
          </Grid>
        </div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose.bind(this)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure that you want to delete this file ?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You can't restore this file after you delete it
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <button onClick={this.handleClose.bind(this)} color="primary">
              Cancel
            </button>
            <button onClick={this.delete.bind(this)} color="primary" autoFocus>
              I'm sure
            </button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={this.state.spaceUsed}
          onClose={this.handleClose.bind(this)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"There no enough space !!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Please remove some files from your device
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <button onClick={this.handleClose.bind(this)} color="primary">
              got it
            </button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
