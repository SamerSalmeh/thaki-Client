import axios from "axios";
import React, { Component } from "react";
import { findDOMNode } from 'react-dom';
import { DragDropContainer, DropTarget } from "react-drag-drop-container";
// import data from "../../../data.json";
import { download , deleteFile } from "../../../renderer";
import style from "./MainScreenStyle.css";
import { Grid } from "@material-ui/core";
import $ from 'jquery'
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
      alo: [],
      url: "",
      newdata: [],
      refresh: false,
    };
    this.sendData = this.sendData.bind(this);
    this.open = this.open.bind(this);
  }
  
  componentWillMount() {
    $('.app').remove();
    // axios.get('https://thaki-server-test.herokuapp.com/api/v1/get/all/objects').then((res) => {
    //     this.setState({
    //         alo: res.data,
    //         refresh:!this.state.refresh
    //     })
    // })
    axios.get("../../data.json").then(data => {
      console.log(data.data.app);
      this.setState({
        newdata: data.data.app,
        refresh: !this.state.refresh,
      });
    });
  }
  open(path) {
    shell.open(path);
  }
  refresh() {
    this.componentWillMount();
  }
  dropped(path,id){
      console.log(path+"xxxx"+id)
    const el = findDOMNode(this.refs.toggle);
    deleteFile(path,id)
    $(el).remove();
    }
  sendData(key) {
    axios
      .post("https://thaki-server-test.herokuapp.com/api/v1/get/object", {
        fileName: key,
      })
      .then(res => {
        const { objectSize } = res.data;
        console.log(objectSize, freeSpace);
        if (objectSize < freeSpace) {
          download(res.data.url);
          this.setState({
            refresh: !this.state.refresh,
          });
        } else {
          alert(
            "there no enough space please remove some files from your device"
          );
        }
      })
      .catch(err => {
        console.log("err", err);
      });
  }
  render() {
      console.log(this.props.children)
    const update = this.state.alo.length
      ? this.state.alo.map((ele, i) => {
          return (
            <button
              className={style.new}
              key={i}
              onClick={() => this.sendData(ele.Key)}
            >
              {ele.Key}
            </button>
          );
        })
      : "fetching data ...";
    const dd = this.state.newdata.length
      ? this.state.newdata.map((ele, i) => {
          return (
            <DragDropContainer ref='toggle' onDrop={()=>this.dropped(ele.path,ele.id)} targetKey="delete" key={i}>
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
              <div className={style.search}>
                <input
                  className={style.SearchInput}
                  type="text"
                  placeholder="Search ..."
                />
                <a href="#">
                  <div className={style.SearchIcon} />
                </a>
              </div>
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
            {dd}
          </Grid>
        </div>
        <div className={style.footer}>
          <Grid className={style.foot} container spacing={24}>
            <Grid item xs={3}>
              <a href="">
                <img src="../src/image/home.png" />
              </a>
            </Grid>
            <Grid item xs={3}>
              <a href="">
                <img src="../src/image/fav.png" />
              </a>
            </Grid>
            <Grid item xs={3}>
              <a href="#" onClick={this.refresh.bind(this)}>
                <img src="../src/image/update.png" />
              </a>
            </Grid>
            <Grid item xs={3}>
              <DropTarget targetKey="delete">
                <a href="">
                  <img src="../src/image/settings.png" />
                </a>
              </DropTarget>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}
