import axios from "axios";
import React, { Component } from "react";
import { findDOMNode } from 'react-dom';
import { DragDropContainer, DropTarget } from "react-drag-drop-container";
// import data from "../../../data.json";
import { download, deleteFile } from "../../../renderer";
import style from "./MainScreenStyle.css";
import { Grid } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import $ from 'jquery'
var shell = require("shelljs");
require("shelljs-plugin-open");

var ds = require("fd-diskspace");
var freeSpace;
// Async
ds.diskSpace(function (err, res) {
    if (err) throw err;
    freeSpace = res.total.free;
    console.log(res.total.free);
});

export default class MainScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alo: [],
            url: "",
            open: false,
            newdata: [],
            found: false,
            src: '../src/image/trashCan.png',
            spaceUsed: false,
            path: { filePath: "", id: "" }
        };
        this.sendData = this.sendData.bind(this);
        this.open = this.open.bind(this);
        this.dropped = this.dropped.bind(this)
    }

    componentWillMount() {
        setInterval(this.refresh.bind(this), 2000);
        console.log("kk")
       

    }
    open(path) {
        shell.open(path);
    }
    changeTrashIconOnHover() {
        this.setState({
            src: "../src/image/openTrashCan.png"
        })
    }
    changeTrashIconOnOut() {
        this.setState({
            src: "../src/image/trashCan.png"
        })
    }
    dropped(path, id) {
        this.delete(path, id)
        this.handleClickOpen()
        this.setState({
            src: "../src/image/trashCan.png"
        })
    }

    delete(filePath, id) {
        
        const x = {
            filePath,
            id
        }
        if (typeof filePath === "string") {
            this.setState({ path: x })
        } else {
            
            console.log(this.state.path.filePath + "xxxx")

            deleteFile(this.state.path.filePath, this.state.path.id)
            
            
            this.handleClose()
        }
    }
    refresh() {
        console.log("refresh")
        axios.get("../../data.json").then(data => {
            this.setState({
                newdata: data.data.app
            });
        });

        axios.get('http://192.168.1.55:3000/api/v1/get/all/objects').then((res) => {
            this.setState({
                alo: res.data
            })
        }).catch(err => {
                console.log("err", err);
            });
    }
    handleClickOpen = () => {
        this.setState({ open: true });
    };
    spaceUsedOpen = () => {
        this.setState({ spaceUsed: true });
    };
    handleClose = () => {
        this.setState({ open: false, spaceUsed: false });
    };


    sendData(key) {
        console.log("connecting to the server .....")
        axios.post("http://192.168.1.55:3000/api/v1/get/object", {
            fileName: key,
        })
            .then(res => {
                const { objectSize } = res.data;
                console.log(objectSize, freeSpace);
                if (objectSize < freeSpace) {
                    download(res.data.url);

                } else {
                    this.spaceUsedOpen()
                }
            })
            .catch(err => {
                console.log("err", err);
            });
    }

    render() {
       
        
        const update = this.state.alo.length
            ? this.state.alo.map((ele, i) => {
                var data = ele.Key.replace(/^.*[\\\/]/, '')
                var found = false
                if (this.state.newdata.length) {
                    this.state.newdata.map((dataEle, index) => {

                        if (data.slice(0, -4) === dataEle.name) {
                            found = true
                        }
                    })
                } else {
                    return <button
                        className={style.new}
                        key={i}
                        onClick={() => this.sendData(ele.Key)}
                    >
                        {data}
                    </button>
                }
                if (found === false) {
                    return <button
                        className={style.new}
                        key={i}
                        onClick={() => this.sendData(ele.Key)}
                    >
                        {data}
                    </button>
                }
            })
            : "fetching data ...";
        const dd = this.state.newdata.length
            ? this.state.newdata.map((ele, i) => {
                return (
                    <DragDropContainer
                        onDrop={() => this.dropped(ele.path, ele.id)}
                        targetKey="delete" key={i}>
                        <Grid className={style.app} item xs={2} >
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
                <div className={style.update}>{update}</div>
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
    */}            </Grid>
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
                        {dd}
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
                            <DropTarget targetKey="delete"
                                onDragEnter={this.changeTrashIconOnHover.bind(this)}
                                onDragLeave={this.changeTrashIconOnOut.bind(this)}>
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
                    <DialogTitle id="alert-dialog-title">{"Are you sure that you want to delete this file ?"}</DialogTitle>
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
                    <DialogTitle id="alert-dialog-title">{"There no enough space !!"}</DialogTitle>
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
