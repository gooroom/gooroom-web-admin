import React from 'react';

import { translate } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ApplyActions from 'modules/PortableUserApplyModule';

import GRPane from 'containers/GRContent/GRPane';

class PortableUserMain extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    const { ApplyProps } = this.props;

    return (
      <div></div>
    )
  }
}

const mapStateToProps = (state) => ({
  ApplyProps: state.PortableUserApplyModule,
});

const mapDispatchToProps = (dispatch) => ({
  ApplyActions: bindActionCreators(ApplyActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(PortableUserMain));
