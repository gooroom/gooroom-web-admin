import React, {Component, PropTypes} from "react"
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import Checkbox from "material-ui/Checkbox"

class GrTreeItem extends Component {

    onClickNode = event => {
        // for don't collapse folder.
        event.stopPropagation();
    };

    render() {
        const {nodeKey, primaryText, style, checked, imperfect} = this.props
        const {onClickNode, leftIcon, rightIcon, onCheckNode} = this.props

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
                <Checkbox
                    onClick={this.onClickNode}
                    onChange={onCheckNode(nodeKey)}
                    checked={checked.indexOf(nodeKey) !== -1}
                    disableRipple
                    indeterminate={imperfect.indexOf(nodeKey) !== -1}
                />
                {leftIcon}
                <ListItemText inset primary={primaryText} />
                {rightIcon}
            </ListItem>

        )
    }
}

// GrTreeItem.PropTypes = {
//     primaryText: PropTypes.string.isRequired,
//     style: PropTypes.object.isRequired,
//     leftIcon: PropTypes.element,
//     rightIcon: PropTypes.element,
//     onTouchTap: PropTypes.func
// }

export default GrTreeItem;
