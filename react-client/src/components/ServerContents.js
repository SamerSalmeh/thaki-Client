import React, { Component } from 'react'
import axios from "axios";
var ds = require("fd-diskspace");

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

import style from "./MainScreenStyle.css";
import { download } from "../../../renderer";

var freeSpace;
// Async
ds.diskSpace(function (err, res) {
    if (err) throw err;
    freeSpace = res.total.free;
    console.log(res.total.free);
});

export default class ServerContents extends Component {
    constructor(props) {
        super(props)

        this.state = {
            serverData: [],
            rights: false,
            pathStore: "",
            spaceUsed: false
        }
        this.sendData = this.sendData.bind(this);
    }
    componentWillMount() {
        // // make refresh every two seconds
        //setInterval(this.refresh.bind(this), 2000);
        // axios.post("https://afternoon-anchorage-52422.herokuapp.com/api/v1/get/all/objects", {
        //     cat: "thaki-games"
        // }).then(res => {
        //     console.log(res)
        //     this.setState({
        //         serverData: res.data,
        //     });
        //     // console.log(this.state.serverData);
        // }).catch(err => {
        //     console.log("err", err);
        // });
    }

    refresh() {
        //get server data
        axios.post("https://afternoon-anchorage-52422.herokuapp.com/api/v1/get/all/objects", {
            cat: "thaki-games"
        }).then(res => {
            console.log(res)
            this.setState({
                serverData: res.data,
            });
            // console.log(this.state.serverData);
        }).catch(err => {
            console.log("err", err);
        });
    }

    //function to close all Dialogs
    handleClose = () => {
        this.setState({ spaceUsed: false, rights: false });
    };

    // function to open announcement Dialog about space used
    spaceUsedOpen = () => {
        this.setState({ spaceUsed: true });
    };
    sendData() {
        console.log("connecting to the server .....", this.state.pathStore);
        axios
            .post("https://afternoon-anchorage-52422.herokuapp.com/api/v1/get/object", {
                fileName: this.state.pathStore,
            })
            .then(res => {

                this.handleClose();

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
    // function to open announcement Dialog about file rights
    rightDialog = (key) => {
        console.log(key)
        this.setState({ rights: true, pathStore: key });
    };
    render() {
        const serverContent = this.state.serverData.length
            ? this.state.serverData.map((ele, i) => {
                //get the raw name from server
                var data = ele.Key.replace(/^.*[\\\/]/, "").slice(0, -4);

                //check if the file exist or not
                var found = false;

                this.props.pass.map((dataEle, index) => {
                    if (data === dataEle.name) {
                        found = true;
                    }
                });
                console.log(ele.Key)
                if (found === false) {
                    return (
                        <button
                            className={style.new}
                            key={i}
                            onClick={() => this.rightDialog(ele.Key)}
                        >
                            {data}
                        </button>
                    );
                }
            })
            : "fetching data ...";
        return (
            <div>
                <div className={style.serverContent}>{serverContent}</div>
                <Dialog
                    open={this.state.rights}
                    onClose={this.handleClose.bind(this)}
                    aria-labelledby="scroll-dialog-title"
                >
                    <DialogTitle id="scroll-dialog-title">
                        {"Rights"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac
                              facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum
                              at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus
                              sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean lacinia bibendum
                              nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur
                              et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla. Cras
                              mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
                              egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                              Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                              lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean lacinia bibendum nulla
                              sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
                              Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla. Cras mattis
                              consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
                              egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                              Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                              lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean lacinia bibendum nulla
                              sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
                              Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla. Cras mattis
                              consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
                              egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                              Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                              lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean lacinia bibendum nulla
                              sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
                              Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla. Cras mattis
                              consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
                              egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                              Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                              lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean lacinia bibendum nulla
                              sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
                              Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla. Cras mattis
                              consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
                              egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                              Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
                              lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean lacinia bibendum nulla
                              sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
                              Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose.bind(this)} color="primary">
                            Disagree
                        </Button>
                        <Button onClick={this.sendData.bind(this)} color="primary" autoFocus>
                            Agree
                        </Button>
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
                        <Button onClick={this.handleClose.bind(this)} color="primary">
                            got it
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
