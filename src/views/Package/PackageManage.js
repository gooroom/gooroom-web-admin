import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { createMuiTheme } from '@material-ui/core/styles';
import { css } from "glamor";

import { grLayout } from "../../templates/default/GrLayout";
import { grColor } from "../../templates/default/GrColors";
import { grRequestPromise } from "../../components/GrUtils/GrRequester";

import GrPageHeader from "../../containers/GrContent/GrPageHeader";

import GrTreeList from "../../components/GrTree/GrTreeList";

import Card, {
  CardHeader,
  CardMedia,
  CardContent,
  CardActions
} from "@material-ui/core/Card";

//
//  ## Style ########## ########## ########## ########## ##########
//
const pageContentClass = css({
  paddingTop: "14px !important"
}).toString();

const listItems = [{title: "one"}];

class PackageManage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <Card>
          <GrPageHeader path={this.props.location.pathname} />
          <CardContent className={pageContentClass}>
            <GrTreeList 
              useFolderIcons={true}
              listHeight="24px"/>
          </CardContent>
        </Card>
      </React.Fragment>
    );
  }
}

export default PackageManage;
