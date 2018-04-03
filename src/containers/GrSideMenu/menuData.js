// This file is shared across the demos.

import React from "react";
import { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import InboxIcon from "material-ui-icons/MoveToInbox";
import DraftsIcon from "material-ui-icons/Drafts";
import StarIcon from "material-ui-icons/Star";
import SendIcon from "material-ui-icons/Send";
import MailIcon from "material-ui-icons/Mail";
import DeleteIcon from "material-ui-icons/Delete";
import ReportIcon from "material-ui-icons/Report";

const RootObject = {
  children: [
    {
      children: [
        {
          children: [ {id: "1", primaryText: "p1"}, {id: "2", primaryText: "p2"}, {id: "3", primaryText: "p3"}]
        },
        {id: "11", primaryText: "p11"},
      ]
    }
  ]
}

const mapStructure = (nodes) => {
  if (nodes) {
    return nodes.map(node => (
      <ListItem
        key={node.id}
        primaryText={node.primaryText}
        initiallyOpen //optional
        nestedItems={mapStructure(node.children)}
      />
    ));
  }
};

const GrMenuItems = ({ RootObject }) => {

  console.log(RootObject);
  return (
    <List>
      {mapStructure(RootObject)}
    </List>
  );
};

export default GrMenuItems;

