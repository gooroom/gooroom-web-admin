import React, { useCallback } from "react";
import { guideContents, guideImages, guideTitles } from "assets/guide";

import Button from "@material-ui/core/Button";
import { GRCommonStyle } from "templates/styles/GRStyles";
import HelpIcon from "@material-ui/icons/Help";
import Typography from "@material-ui/core/Typography";
import useDialog from "hooks/useDialog";
import { withStyles } from "@material-ui/core/styles";

const GRPageHeader = (props) => {
  const { show: dialogShow, hide: dialogHide } = useDialog();
  const { name, classes } = props;

  const onGuide = useCallback(() => {
    dialogShow({
      title: name,
      image: guideImages[name],
      contentTitle: guideTitles[name],
      content: guideContents[name],
      cancelLabel: "닫기",
      showOk: false,
    });
  }, [dialogShow, dialogHide]);

  return (
    <Typography variant="h6" gutterBottom className={classes.menuHeaderTitle}>
      {name}
      {!!guideImages[name] && (
        <Button onClick={onGuide}>
          <HelpIcon />
        </Button>
      )}
    </Typography>
  );
};

export default withStyles(GRCommonStyle)(GRPageHeader);
