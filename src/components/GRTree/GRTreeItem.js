import React, {Component, PropTypes} from "react"

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Checkbox from "@material-ui/core/Checkbox"

class GRTreeItem extends Component {

    onClickNode = event => {
        // for don't collapse folder.
        event.stopPropagation();
    };

    render() {
        const {nodeKey, primaryText, style, checked, imperfect, isShowCheck, isEnableEdit} = this.props
        const {onClickNode, leftIcon, editIcon, rightIcon, onCheckNode} = this.props

        const styles = {
            root: {
                cursor: "pointer",
                transition: "all 0.25s ease-in-out"
            },
            primaryText: {
                lineHeight: "32px"
            }
        }

        return (
            
            <ListItem button
                style={Object.assign({}, styles.root, style)}
                onClick={onClickNode}>
                {(isShowCheck) && 
                <Checkbox color="primary"
                    onClick={this.onClickNode}
                    onChange={onCheckNode(nodeKey)}
                    checked={checked.indexOf(nodeKey) !== -1}
                    disableRipple
                    indeterminate={imperfect.indexOf(nodeKey) !== -1}
                />
                }
                {leftIcon}
                <ListItemText inset primary={primaryText} />
                {isEnableEdit && editIcon}
                {rightIcon}
            </ListItem>

        )
    }
}

// GRTreeItem.PropTypes = {
//     primaryText: PropTypes.string.isRequired,
//     style: PropTypes.object.isRequired,
//     leftIcon: PropTypes.element,
//     rightIcon: PropTypes.element,
//     onTouchTap: PropTypes.func
// }

export default GRTreeItem;

