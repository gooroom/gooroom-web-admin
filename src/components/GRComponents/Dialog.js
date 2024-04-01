import React, { useState } from "react";
import { Trans, translate } from "react-i18next";

import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import CloseIcon from "@material-ui/icons/Close";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { GRCommonStyle } from "templates/styles/GRStyles";
import { Dialog as MUDialog } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import useDialog from "../../hooks/useDialog";
import { withStyles } from "@material-ui/core/styles";

const Dialog = ({
  classes,
  visible = false,
  showOk = true,
  title = "",
  image = [],
  contentTitle = [],
  content = [],
  hasCheck = false,
  checkMessage = "",
  cancelLabel = "아니오",
  confirmLabel = "예",
  onConfirm = () => {},
}) => {
  const { hide } = useDialog();

  const [selected, setSelected] = useState(false);
  const [index, setIndex] = useState(0);

  const handleConfirm = () => {
    if (hasCheck) {
      onConfirm(selected);
    } else {
      onConfirm();
    }
  };

  const onPrevious = () => {
    setIndex((prev) => prev - 1);
  };

  const onNext = () => {
    setIndex((prev) => prev + 1);
  };

  const onClose = () => {
    hide();
    setTimeout(() => setIndex(0), 500);
  };

  return (
    <MUDialog
      onClose={onClose}
      open={visible}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className={classes.GuideDialog}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle id="alert-dialog-title" disableTypography={true}>
        <span className="title-label">{title}</span>
      </DialogTitle>
      <img style={{ maxWidth: "100%", maxHeight: "calc(100vh - 64px)", margin: "24px" }} src={`./resources/image/${image[index]}.jpg`} alt="image" />
      <DialogContent>
        <span>{contentTitle[index]}</span>
      </DialogContent>
      <DialogContent>
        <span>{content[index]}</span>
      </DialogContent>
      <DialogActions>
        {content.length > 1 && (
          <div>
            <Button className={classes.GuideDialogButton} disabled={index === 0} onClick={onPrevious} variant="contained" color="secondary">
              이전
            </Button>
            <Button className={classes.GuideDialogButton} disabled={index === content.length - 1} onClick={onNext} variant="contained" color="secondary">
              다음
            </Button>
          </div>
        )}
        <Button className={classes.GuideDialogButton} onClick={onClose} variant="contained" color="primary" autoFocus>
          {cancelLabel}
        </Button>
      </DialogActions>
    </MUDialog>
  );
};

export default translate("translations")(withStyles(GRCommonStyle)(Dialog));
