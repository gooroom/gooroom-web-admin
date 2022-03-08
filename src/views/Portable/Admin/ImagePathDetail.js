import React from 'react';

import { withStyles } from "@material-ui/core/styles";
import { GRCommonStyle } from "templates/styles/GRStyles";
import { translate, Trans } from 'react-i18next';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ApplyActions from 'modules/PortableApplyModule';

import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

class ImagePathDetail extends React.Component {

  handleOk = () => {
    const { ApplyActions, ApplyProps } = this.props;
    ApplyActions.openImagePathDetail(false, ApplyProps.get('imagePath'));
  }

  render() {
    const { t, classes } = this.props;
    const { ApplyProps } = this.props;

    return(
      <Dialog maxWidth="lg" open={ApplyProps.get('isOpenImagePath')}>
        <DialogTitle
          sx={{ m: 0, p: 2 }}
        >{t('lbImagePathTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-title">
            { ApplyProps.get('imagePath') }
          </DialogContentText>
          <DialogActions>
            <Button onClick={this.handleOk} color="primary">
              {t("btnOK")}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    );
  }
}

const mapStateToProps = (state) => ({
  ApplyProps: state.PortableApplyModule,
});

const mapDispatchToProps = (dispatch) => ({
  ApplyActions: bindActionCreators(ApplyActions, dispatch),
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ImagePathDetail)));