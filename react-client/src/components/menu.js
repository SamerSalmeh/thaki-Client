import React, { Component } from 'react'
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import VideoCamIcon from "@material-ui/icons/VideoCam";
import VideoGameAssetIcon from "@material-ui/icons/VideoGameAsset";
import ImageIcon from "@material-ui/icons/Image";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import DeleteIcon from "@material-ui/icons/Delete";
import FontDownloadIcon from "@material-ui/icons/FontDownload";

export default class MailFolderListItems extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }
  componentWillMount() {
  }


  render() {
    return (
      <div>
        <ListItem button onClick={() => this.props.buttonClick("video")} >
          <ListItemIcon>
            <VideoCamIcon />
          </ListItemIcon>
          <ListItemText primary="Video" />
        </ListItem>
        <ListItem button onClick={() => this.props.buttonClick("image")} >
          <ListItemIcon>
            <ImageIcon />
          </ListItemIcon>
          <ListItemText primary="Image" />
        </ListItem>
        <ListItem button onClick={() => this.props.buttonClick("sound")} >
          <ListItemIcon>
            <MusicNoteIcon />
          </ListItemIcon>
          <ListItemText primary="Sound" />
        </ListItem>
        <ListItem button onClick={() => this.props.buttonClick("html")} >
          <ListItemIcon>
            <VideoGameAssetIcon />
          </ListItemIcon>
          <ListItemText primary="Html" />
        </ListItem>
        <ListItem button onClick={() => this.props.buttonClick("text")} >
          <ListItemIcon>
            <FontDownloadIcon />
          </ListItemIcon>
          <ListItemText primary="Text" />
        </ListItem>
      </div>
      )
  }
}


export const OtherMailFolderListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <LocationCityIcon />
      </ListItemIcon>
      <ListItemText primary="All mail" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <DeleteIcon />
      </ListItemIcon>
      <ListItemText primary="Trash" />
    </ListItem>
  </div>
);
