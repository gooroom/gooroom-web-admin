import React, { Component } from "react";

import ListSubheader from 'material-ui/List/ListSubheader';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

import GrTreeItem from "./GrTreeItem";

import OpenIcon from "@material-ui/icons/ExpandMore";
import CloseIcon from "@material-ui/icons/ExpandLess";
import FolderIcon from "@material-ui/icons/Folder";
import FileIcon from "@material-ui/icons/InsertDriveFile";

const listItems = [
    {key: "tree_0", depth: 0, disabled: false, title:"treenode0", children:["0", "0", "0"]},
    {key: "tree_1", depth: 1, parentIndex: 0, disabled: false, title:"treenode1"},
    {key: "tree_2", depth: 1, parentIndex: 0, disabled: false, title:"treenode2", children:["3"]},
    {key: "tree_4", depth: 2, parentIndex: 2, disabled: false, title:"treenode4"},
    {key: "tree_3", depth: 1, parentIndex: 0, disabled: false, title:"treenode3", children:["5", "6"]},
    {key: "tree_6", depth: 2, parentIndex: 4, disabled: false, title:"treenode6"},
    {key: "tree_7", depth: 2, parentIndex: 4, disabled: false, title:"treenode7"},
    {key: "tree_5", depth: 1, parentIndex: 0, disabled: true, title:"treenode5"},
];


class GrTreeList extends Component {

    constructor(props) {

        super(props);

        this.state = {
            expandedListItems: [],
            activeListItem: null,
            searchTerm: ''
        }

        this.handleTouchTap = this.handleTouchTap.bind(this);
    }

    handleTouchTap(listItem, index) {
        console.log("handleTouchTap >>> " + listItem + ", " + index);

        if (listItem.children) {
            const indexOfListItemInArray = this.state.expandedListItems.indexOf(index)
            if  (indexOfListItemInArray === -1) {
                this.setState({
                    expandedListItems: this.state.expandedListItems.concat([index])
                })
            } else {
                let newArray = [].concat(this.state.expandedListItems)
                newArray.splice(indexOfListItemInArray, 1)
                this.setState({
                    expandedListItems: newArray
                })
            }
        } else {
            this.setState({
                activeListItem: index
            })
        }

        if (this.props.handleTouchTap) this.props.handleTouchTap(listItem, index);
    }
    
    render() {

        const contentKey = "title";

        const startingDepth = (this.props.startingDepth) ? this.props.startingDepth : 0;
        const listHeight = (this.props.listHeight) ? this.props.listHeight : "36px";
        const activeListItem = (this.props.activeListItem) ? this.props.activeListItem : this.state.activeListItem;
        const expandedListItems = (this.props.expandedListItems) ? this.props.expandedListItems : this.state.expandedListItems;

        let listItemsModified = listItems
            .map((listItem, i, inputArray) => {
                listItem._styles = {
                    root: {
                        paddingLeft: (listItem.depth - startingDepth) * 16,
                        backgroundColor: (activeListItem === i) ? 'rgba(0,0,0,0.2)' : null,
                        height: listHeight,
                        cursor: (listItem.disabled) ? 'not-allowed' : 'pointer',
                        color: (listItem.disabled) ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.87)',
                        overflow: 'hidden',
                        transform: 'translateZ(0)'                       
                    }
                }

                listItem._shouldRender = (listItem.depth >= startingDepth && parentsAreExpanded(listItem));
                listItem._primaryText = listItem[contentKey];

                return listItem;
            });
        
        // Search Node...



        // JSX: array of listItems
        const listItemsJSX = listItemsModified
            .map((listItem, i) => {
                console.log(listItem);
                if (listItem._shouldRender) {
                    return (
                        <GrTreeItem
                            key={'treeListItem-' + i}
                            primaryText={listItem._primaryText}
                            style={Object.assign({}, listItem._styles.root)}
                            leftIcon={getLeftIcon(listItem, this.props.useFolderIcons)}
                            rightIcon={(!listItem.children) ? null : (expandedListItems.indexOf(i) === -1) ? <OpenIcon /> : <CloseIcon />}
                            onTouchTap={() => {
                                if (listItem.disabled) {
                                    return
                                }
                                this.handleTouchTap(listItem, i);
                            }} />                   
                    )                   
                } else {
                    return null
                }
            });


        return (
            <React.Fragment>
                <List>
                {listItemsJSX}
                </List>
            </React.Fragment>
        );


        function getLeftIcon(listItem, useFolderIcons) {

            if (useFolderIcons) {
                if (listItem.children) {
                    return <FolderIcon />
                } else {
                    return <FileIcon />
                }
            } else {
                return listItem.icon
            }
        }

        function parentsAreExpanded(listitem) {

            if (listitem.depth > startingDepth) {
                if (expandedListItems.indexOf(listitem.parentIndex) === -1) {
                    return false
                } else {
                    const parent = listItems.filter((_listItem, index) => {
                        return index === listitem.parentIndex
                    })[0]
                    return parentsAreExpanded(parent)
                }
            } else {
                return true
            }
        }
        
    }
}

export default GrTreeList;

