import React, {Component, PropTypes} from "react"
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

class GrTreeItem extends Component {
    render() {
        const {primaryText, style} = this.props
        const {onTouchTap, leftIcon, rightIcon} = this.props

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
                onClick={onTouchTap}>
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

