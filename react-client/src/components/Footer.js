import React, { Component } from 'react'

import { deleteFile } from "../../../renderer";
import style from "./MainScreenStyle.css";

import { DropTarget } from "react-drag-drop-container";

import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

var sudo = require('sudo-prompt');
var options = {
    name: 'Electron',
    icns: '../image/thakiLogo.png', // (optional)
};

export default class Footer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            src: "../src/image/trashCan.png",
            open: false,
            pathStore: ""
        }
    }

    //function to close Dialog
    handleClose = () => {
        this.setState({ open: false });
    };

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
        var file = this.state.pathStore
        sudo.exec('echo hello', options,
            function (error, stdout, stderr) {
                if (error) { console.log("delete have been failed becuse ", error); }
                else {
                    deleteFile(file);
                }
            }
        );
        this.handleClose();
    }

    render() {
        return (
            <div>
                <Grid className={style.foot} container spacing={24}>
                    <Grid item xs={3}>
                        <a onClick={() => this.props.buttonClick("")}>
                            <img src="../src/image/home.png" />
                        </a>
                    </Grid>
                    <Grid item xs={3}>
                    </Grid>
                    <Grid item xs={3}>
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
                        <Button onClick={this.handleClose.bind(this)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.delete.bind(this)} color="primary" autoFocus>
                            I'm sure
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
