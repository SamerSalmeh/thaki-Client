import axios from "axios";
import React, { Component } from "react";
import { DragDropContainer } from "react-drag-drop-container";
import SearchInput, { createFilter } from 'react-search-input'
import PropTypes from 'prop-types';

import { openFile, Zero } from "../../../renderer";
import style from "./MainScreenStyle.css";
import ServerContents from "./ServerContents";
import Footer from "./Footer";
import MailFolderListItems from './menu';
import Background from '../image/background.png';

import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

//importing react material ui
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Drawer from '@material-ui/core/Drawer';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';
//you can add key of what you search for like : by name, by path
const KEYS_TO_FILTERS = ['name', 'categorie', 'tag']

const drawerWidth = 240;

const styles = theme => ({
  root: {
    backgroundImage: `url(${Background})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100%',
    backgroundPosition: 'bottom',
    flexGrow: 1,
    height: 600,
    overflow: "hidden",
    position: "relative",
    display: "flex"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  hide: {
    display: "none"
  },
  drawerPaper: {
    height: '322px',
    overflow: "hidden",
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * 9
    }
  },
  tags: {
    overflow: "hidden",
    position: "relative",
    whiteSpace: "nowrap",
    textAlign: "center",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  tag: {
  },
  tagsButton: {
    width: 100,
    height: 0,
    display: "inline-block",
    borderLeft: "50px solid transparent",
    borderRight: "50px solid transparent",
    borderBottom: "30px solid #f0f8e4",
    transition: theme.transitions.create(["height", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  tagsButtonShift: {
    transition: theme.transitions.create(["margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3
  }
});
class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newdata: [],
      bottom: false,
      searchTerm: '',
      filter: '',
      drawerOpen: false,
      newarr: [],
      tagArr: []
    };
    this.searchUpdated = this.searchUpdated.bind(this)
    this.open = this.open.bind(this);
    this.dropped = this.dropped.bind(this);
    this.toggleTagsDrawer = this.toggleTagsDrawer.bind(this);
    this.hh = this.hh.bind(this);
  }

  componentWillMount() {
    // make refresh every two seconds
    setInterval(this.refresh.bind(this), 1000);
  }

  // function to open file in device directly by path
  open(path) {
    openFile(path);
  }

  toggleTagsDrawer() {
    this.setState({
      bottom: !this.state.bottom,
    });
    this.hh()
  };

  handleDrawerOpen = () => {
    console.log("gg")
    this.setState({ drawerOpen: true });
  };

  handleDrawerClose = () => {
    console.log("jj")
    this.setState({ drawerOpen: false });
  };

  //function to pass path of file to Footer to delete it
  dropped(path) {
    this.refs.footer.dropped(path)
  }

  //this function hold two api ... one to get data from server and one to get data from JSON file
  //and it refreshing every two seconds
  refresh() {
    console.log("Refresh");

    // get JSON file date
    axios.get("../../data.json").then(data => {
      this.setState({
        newdata: data.data.app,
      });
    });

    // axios.get("https://afternoon-anchorage-52422.herokuapp.com/api/v1/click/analytics",this.state.newdata)
    //   .then(res => {
    //     Zero()
    //   })
    //   .catch(err => {
    //     console.log("err", err);
    //   })
  }
  hh() {
    var g = []
    this.state.newdata.map((el, i) => {
      el.tag.map((ele, index) => {
        if (!g.includes(ele)) {
          g.push(ele)
        }
      })
    })
    this.setState({ newarr: g })
  }

  searchUpdated(term) {
    console.log(term)
    this.setState({ searchTerm: term })
  }

  cheakTag(e, tag) {
    if (!this.state.tagArr.includes(tag)) {
      if (e.currentTarget.tagName === "svg") {
        e.target.style.border = "2px solid green"
      } else {
        e.currentTarget.parentElement.style.border = "2px solid green"
      }
      this.setState({
        tagArr: [...this.state.tagArr, tag]
      })
    } else {
      e.target.style.border = "0px solid green"
      const tagIndex = this.state.tagArr.indexOf(tag)
      var array = [...this.state.tagArr]
      array.splice(tagIndex, 1)
      this.setState({
        tagArr: array
      })
    }
  }

  searchTag() {
    // const f = this.state.tagArr.toString()
    this.searchUpdated(this.state.tagArr.join(" "))
  }
  render() {
    const { classes, theme } = this.props;
    // search process
    const search = this.state.newdata.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))

    // return files of JSON file to the user screen as images
    const installedApp = this.state.newdata.length
      ? search.map(file => {
        return (
          <Grid className={style.app} item xs={2} key={file.name}>
            <DragDropContainer
              onDrop={() => this.dropped(file.path)}
              targetKey="delete"
            >
              <img
                onClick={() => this.open(file.path)}
                className={style.icon}
                src={file.image}
              />
              <br />
              {file.name}
            </DragDropContainer>
          </Grid>
        )
      })
      : "empty";
    const ff = this.state.newarr.map((ele, index) => {

      return (
        <Chip
          deleteIcon={<DoneIcon />}
          key={index}
          label={ele}
          // onClick={(e) => this.addTag(e, ele)}
          onDelete={(e) => this.cheakTag(e, ele)}
          className={style.new}
        />
        // <button
        //   key={index}
        //   className={style.new}
        //   onClick={() => this.searchUpdated(ele)}
        // >
        //   {ele}
        // </button>
      )
    })
    return (
      <div className={style.main}>

        <ServerContents pass={this.state.newdata} />

        <div className={classes.root}>
          <AppBar
            style={{ background: '#7ba330', boxShadow: 'none' }}
            position="absolute"
            className={classNames(
              classes.appBar,
              this.state.drawerOpen && classes.appBarShift
            )}
          >
            <Toolbar disableGutters={!this.state.drawerOpen}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(
                  classes.menuButton,
                  this.state.drawerOpen && classes.hide
                )}
              >
                <MenuIcon />
              </IconButton>

              <div className={style.search}>
                <SearchInput className={style.SearchInput} onChange={this.searchUpdated} />
                <div className={style.SearchIcon} />
              </div>

            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            classes={{
              paper: classNames(
                classes.drawerPaper,
                !this.state.drawerOpen && classes.drawerPaperClose
              )
            }}
            open={this.state.drawerOpen}
          >
            <div className={classes.toolbar}>
              <IconButton onClick={this.handleDrawerClose}>
                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </div>
            <Divider />
            <List><MailFolderListItems buttonClick={this.searchUpdated} /></List>
            <Divider />
          </Drawer>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Grid className={style.apps} container spacing={24}>
              {installedApp}
            </Grid>
          </main>
        </div>
        <div className={style.footer}>
          <div onClick={() => this.toggleTagsDrawer()}
            className={classes.tagsButton}>
            <p>Open Bottom</p>
          </div>
          <Drawer
            className={classes.tags}
            anchor="bottom"
            open={this.state.bottom}
            onClose={() => this.toggleTagsDrawer()}
          >
            <List>{ff}</List>
            <Divider />
            <button onClick={() => this.searchTag()}>Applay</button>
          </Drawer>
          <Footer buttonClick={this.searchUpdated} ref="footer" />
        </div>
      </div>
    );
  }
}
MainScreen.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};
export default withStyles(styles, { withTheme: true })(MainScreen);