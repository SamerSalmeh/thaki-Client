import React, { Component } from 'react'
import style from './MainScreenStyle.css'
import { Button, Grid } from '@material-ui/core';
// import data from "../../../data.json";
import { download } from '../../../renderer'
import axios from 'axios';
var shell = require('shelljs');
 require('shelljs-plugin-open');
export default class MainScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alo: [],
            url:'',
            newdata:[],
            refresh:false
        }
        this.sendData = this.sendData.bind(this)
        this.open = this.open.bind(this)
    }
    componentWillMount() {
        axios.get('https://thaki-server-test.herokuapp.com/api/v1/get/all/objects').then((res) => {
            this.setState({
                alo: res.data,
                refresh:!this.state.refresh
            })
        })
        axios.get('../../data.json').then((data) => {
            console.log(data.data.app)
            this.setState({
                newdata: data.data.app,
                refresh:!this.state.refresh
            })
        })
         
    }
    open(path){
        shell.open(path)
    }
    refresh(){
        this.componentWillMount()
    }
    sendData(key)  {
        axios.post('https://thaki-server-test.herokuapp.com/api/v1/get/object', { fileName: key})
            .then((res) => {
               download(res.data.url)
               this.setState({
                   refresh:!this.state.refresh
               })
            }).catch((err) => {
                console.log('err', err)
            })
    }
    render() {
        const update = this.state.alo.length?this.state.alo.map((ele,i)=>{
            return <button  className={style.new} key ={i} onClick={()=>this.sendData(ele.Key)}>{ele.Key}</button>
        })
        :"fetching data ..."
        const dd = this.state.newdata.length?this.state.newdata.map((ele, i) =>{
        return <Grid  className={style.app} item xs={2} key={i}>
            <img onClick={()=>this.open(ele.path)} className={style.icon} src={ele.image} />
            <br />
            {ele.name}
        </Grid>
        }):"empty"
        return (
            <div className={style.main}>
                <div className={style.update}>
                    {update} 
                </div>
                <div className={style.head}>

                    <Grid className={style.header} container spacing={24}>
                        <Grid item xs={4}>
                            <div className={style.search}>
                                <input className={style.SearchInput} type="text" placeholder="Search ..."/>
                                <a href="#"><div className={style.SearchIcon}></div></a>
                                
                            </div>
                        </Grid>
                        <Grid item xs={4}></Grid>
                        <Grid item xs={4}>
                            {/* <button className={style.filter}>
                                <div className={style.FilterIcon}></div>
                            </button> */}
                        </Grid>
                    </Grid>
                </div>
                <div>
                    <Grid className={style.apps} container spacing={24}>
                        {
                            dd
                        }
                    </Grid>
                </div>
                <div className={style.footer}>
                    <Grid className={style.foot} container spacing={24}>
                        <Grid item xs={3}>
                            <a href=""><img src="../src/image/home.png" /></a>
                        </Grid>
                        <Grid item xs={3}>
                            <a href=""><img src="../src/image/fav.png" /></a>
                        </Grid>
                        <Grid item xs={3}>
                            <a href="#" onClick={this.refresh.bind(this)}><img src="../src/image/update.png" /></a>
                        </Grid>
                        <Grid item xs={3}>
                            <a href=""><img src="../src/image/settings.png" /></a>
                        </Grid>
                    </Grid>
                </div>
            </div>
        )
    }
}
