import React, { Component } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

export const styles = theme => ({
  /* Styles applied to the root element. */
  root: theme.mixins.gutters({
    display: 'flex',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 0,
    "@media (min-width:600px)": {
      paddingLeft: 10,
      paddingRight: 10
    }
  }),
  /* Styles applied to the card category name. */
  category: {
    margin: 0,
    fontSize: 12,
    fontWeight:'bold',
    background: 'linear-gradient(45deg, #737357 30%, #a7a799 90%)',
    color: 'white',
    padding: '0 5'
  },
  /* Styles applied to the avatar element. */
  avatar: {
    flex: '0 0 auto',
    marginRight: 16,
  },
  /* Styles applied to the action element. */
  action: {
    flex: '0 0 auto',
    alignSelf: 'flex-start',
    marginTop: -8,
    marginRight: -12,
    [theme.breakpoints.up('sm')]: {
      marginRight: -20,
    },
  },
  /* Styles applied to the content wrapper element. */
  content: {
    flex: '1 1 auto',
  },
  /* Styles applied to the title Typography element. */
  title: {},
  /* Styles applied to the subheader Typography element. 
  subheader: {},
  */
});

function GRSoftwareCardHeader(props) {
  const {
    action,
    avatar,
    classes,
    className: classNameProp,
    component: Component,
    disableTypography,
    // subheader: subheaderProp,
    subheaderTypographyProps,
    title: titleProp,
    titleTypographyProps,
    category: categoryProp,
    categoryTypographyProps,
    ...other
  } = props;

  let title = titleProp;
  if (title != null && title.type !== Typography && !disableTypography) {
    title = (
      <Typography
        variant={avatar ? 'body2' : 'headline'}
        internalDeprecatedVariant
        className={classes.title}
        component="span"
        {...titleTypographyProps}
      >
        {title}
      </Typography>
    );
  }

  // let subheader = subheaderProp;
  // if (subheader != null && subheader.type !== Typography && !disableTypography) {
  //   subheader = (
  //     <Typography
  //       variant={avatar ? 'body2' : 'body1'}
  //       className={classes.subheader}
  //       color="textSecondary"
  //       component="span"
  //       {...subheaderTypographyProps}
  //     >
  //       {subheader}
  //     </Typography>
  //   );
  // }

  let category = categoryProp;
  if (category != null && category.type !== Typography && !disableTypography) {
    category = (
      <Typography
        variant={avatar ? 'body2' : 'headline'}
        internalDeprecatedVariant
        className={classes.category}
        component="span"
        {...titleTypographyProps}
      >
        {category}
      </Typography>
    );
  }

  return (
    <Component {...other}>
      {category}
    </Component>
  );
}

GRSoftwareCardHeader.propTypes = {
  /**
   * The action to display in the card header.
   */
  action: PropTypes.node,
  /**
   * The Avatar for the Card Header.
   */
  avatar: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   * See [CSS API](#css-api) below for more details.
   */
  classes: PropTypes.object.isRequired,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The component used for the root node.
   * Either a string to use a DOM element or a component.
   */
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object]),
  /**
   * If `true`, the children won't be wrapped by a Typography component.
   * This can be useful to render an alternative Typography variant by wrapping
   * the `title` text, and optional `subheader` text
   * with the Typography component.
   */
  disableTypography: PropTypes.bool,
  /**
   * The content of the component.
   */
  subheader: PropTypes.node,
  /**
   * These props will be forwarded to the subheader
   * (as long as disableTypography is not `true`).
   */
  subheaderTypographyProps: PropTypes.object,
  /**
   * The content of the Card Title.
   */
  title: PropTypes.node,
  /**
   * These props will be forwarded to the title
   * (as long as disableTypography is not `true`).
   */
  titleTypographyProps: PropTypes.object,
};

GRSoftwareCardHeader.defaultProps = {
  component: 'div',
  disableTypography: false,
};

export default withStyles(styles, { name: 'GRSoftwareCardHeader' })(GRSoftwareCardHeader);
