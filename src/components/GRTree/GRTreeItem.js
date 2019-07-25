import React, {Component} from "react"

import IconButton from '@material-ui/core/IconButton';
import OpenIcon from "@material-ui/icons/ExpandMore";
import CloseIcon from "@material-ui/icons/ExpandLess";
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Checkbox from "@material-ui/core/Checkbox";
import ShowIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import ShowIconSelected from "@material-ui/icons/RemoveRedEye";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class GRTreeItem extends Component {

    onClickCheckbox = event => {
        // for don't collapse folder.
        event.stopPropagation();
    };

    render() {
        const { classes } = this.props;
        const { nodeKey, primaryText, depth, startingDepth, style, checked, imperfect } = this.props
        const { isShowCheck, isShowDetail = false, isEnableEdit, isCheckMasterOnly } = this.props
        
        const { isShowMemberCnt, memberCntValue } = this.props
        const { onClickNode, onClickDetailNode, onFoldingNode, onEditNode, leftIcon, onCheckNode, isExtend, isActive } = this.props

        const styles = {
            root: {
                cursor: "pointer",
                transition: "all 0.25s ease-in-out"
            },
            primaryText: {
                lineHeight: "32px"
            }
        }

        let nodeTitle = primaryText;
        if(isShowMemberCnt) {
            nodeTitle = '[' + memberCntValue + '] ' + primaryText;
        }

        return (
            <ListItem button style={Object.assign({}, styles.root, style)} >
                {(isShowCheck) &&
                <Checkbox color="primary"
                    onClick={this.onClickCheckbox}
                    onChange={onCheckNode}
                    checked={checked.indexOf(nodeKey) !== -1}
                    disableRipple
                    indeterminate={imperfect.indexOf(nodeKey) !== -1}
                    disabled={(isCheckMasterOnly && depth != 2)}
                    style={{color: (isCheckMasterOnly && depth != 2) ? '#cecece' : '#737373',width:24}}
                />
                }
                {leftIcon}
                {(isShowDetail) &&
                    <IconButton style={{padding:0}} onClick={onClickDetailNode}>{(isActive) ? <ShowIconSelected style={{color:'#ef5350'}} /> : <ShowIcon />}</IconButton>
                }
                <ListItemText inset primary={nodeTitle} onClick={onClickNode} style={{paddingLeft:4}} />
                {(isExtend == 'Y') && 
                    <IconButton style={{padding:0}} onClick={onClickNode}><OpenIcon /></IconButton>
                }
                {(isExtend == 'N') && 
                    <IconButton style={{padding:0}} onClick={onFoldingNode}><CloseIcon /></IconButton>
                }
                {isEnableEdit && 
                <IconButton onClick={onEditNode} style={{padding:0}}><SettingsApplicationsIcon style={{color:'darkgray',fontSize:'28px',paddingTop:4}} /></IconButton>
                }
            </ListItem>

        )
    }
}

export default (withStyles(GRCommonStyle)(GRTreeItem));
