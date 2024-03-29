import React, { Component } from "react";
import * as Constants from "components/GRComponents/GRConstants";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import moment from "moment";

import * as GlobalActions from "modules/GlobalModule";
import * as DeptActions from "modules/DeptModule";
import * as UserActions from "modules/UserModule";
import * as UserReqActions from "modules/UserReqModule";
import * as GRConfirmActions from "modules/GRConfirmModule";
import * as GRAlertActions from "modules/GRAlertModule";

import * as TotalRuleActions from "modules/TotalRuleModule";

import {
  getRowObjectById,
  getDataObjectVariableInComp
} from "components/GRUtils/GRTableListUtils";

import GRPageHeader from "containers/GRContent/GRPageHeader";
import DeptTreeComp from "views/User/DeptTreeComp";

import GRPane from "containers/GRContent/GRPane";
import GRConfirm from "components/GRComponents/GRConfirm";
import GRCheckConfirm from "components/GRComponents/GRCheckConfirm";

import BrowserRuleDialog from "views/Rules/UserConfig/BrowserRuleDialog";
import SecurityRuleDialog from "views/Rules/UserConfig/SecurityRuleDialog";
import MediaRuleDialog from "views/Rules/UserConfig/MediaRuleDialog";
import SoftwareFilterDialog from "views/Rules/UserConfig/SoftwareFilterDialog";
import CtrlCenterItemDialog from "views/Rules/UserConfig/CtrlCenterItemDialog";
import PolicyKitRuleDialog from "views/Rules/UserConfig/PolicyKitRuleDialog";
import DesktopConfDialog from "views/Rules/DesktopConfig/DesktopConfDialog";
import DesktopAppDialog from "views/Rules/DesktopConfig/DesktopApp/DesktopAppDialog";

import UserListComp from "views/User/UserListComp";
import UserSpec from "views/User/UserSpec";
import UserSelectDialog from "views/User/UserSelectDialog";
import UserDialog from "views/User/UserDialog";
import UserBasicDialog from "views/User/UserBasicDialog";

import DeptSpec from "views/User/DeptSpec";
import DeptSelectDialog from "views/User/DeptSelectDialog";
import DeptDialog from "views/User/DeptDialog";
import DeptMultiDialog from "views/User/DeptMultiDialog";

import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";

import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import TuneIcon from "@material-ui/icons/Tune";
import UserIcon from "@material-ui/icons/Person";
import DeptIcon from "@material-ui/icons/WebAsset";
import MoveIcon from "@material-ui/icons/Redo";
import AccountIcon from "@material-ui/icons/AccountBox";

import { withStyles } from "@material-ui/core/styles";
import { GRCommonStyle } from "templates/styles/GRStyles";
import { translate } from "react-i18next";

class UserMasterManage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      compId: this.props.match.params.grMenuId,
      isOpenUserSelect: false,
      isOpenDeptSelect: false,
      selectedDept: { deptCd: "", deptNm: "" }
    };
  }

  handleInitTreeData = () => {
    // Check selectedDeptCd
    this.props.DeptActions.changeCompVariableObject({
      compId: this.state.compId,
      valueObj: { selectedDeptCd: "", selectedDeptNm: "" }
    });
  };

  // click dept checkbox (in tree)
  handleCheckedDept = (checkedDeptCdArray, imperfect) => {
    const { UserProps, UserActions } = this.props;

    // SET checked
    this.props.DeptActions.changeTreeDataVariable({
      compId: this.state.compId,
      name: "checked",
      value: checkedDeptCdArray
    });

    // show user list in dept.
    UserActions.readUserListPaged(
      UserProps,
      this.state.compId,
      {
        deptCd: checkedDeptCdArray,
        page: 0
      },
      { isResetSelect: true }
    );
  };

  // click dept row (in tree)
  handleSelectDept = selectedDeptObj => {
    const { TotalRuleActions, DeptActions, UserActions } = this.props;
    const compId = this.state.compId;
    // change selected info in store
    DeptActions.changeTreeDataVariable({
      compId: compId,
      name: "selectedDept",
      value: selectedDeptObj
    });
    // close user inform
    UserActions.closeInform({ compId: compId });
    // Check selectedDeptCd
    DeptActions.changeCompVariableObject({
      compId: compId,
      valueObj: {
        viewItem: selectedDeptObj,
        informOpen: true
      }
    });

    TotalRuleActions.getAllClientUseRuleByDeptCd({
      compId: compId,
      deptCd: selectedDeptObj.get("deptCd")
    });
  };

  // click user row (in list)
  handleSelectUser = selectedUserObj => {
    const { TotalRuleActions } = this.props;
    const { UserActions, DeptActions, UserReqActions } = this.props;
    const compId = this.state.compId;

    // show user info.
    if (selectedUserObj) {
      // show user configurations.....
      TotalRuleActions.getAllClientUseRuleByUserId({
        compId: compId,
        userId: selectedUserObj.get("userId")
      });

      // for user media rule request
      UserReqActions.readUserReqList({
        compId: compId,
        targetType: 'userReqList',
        userId: selectedUserObj.get("userId")
      })

      UserReqActions.getServerConf({
        compId: compId
      })
      
      // close dept infrom
      DeptActions.closeInform({ compId: compId });
      // show user inform pane.
      UserActions.showInform({ compId: compId, viewItem: selectedUserObj });

      // hide dept active
      DeptActions.changeTreeDataVariable({
        compId: compId,
        name: "activeListItem",
        value: ""
      });
    }
  };

  // edit dept in tree
  handleEditDept = treeNode => {
    const { TotalRuleActions, DeptActions } = this.props;
    if (treeNode && treeNode.get("deptCd")) {
      TotalRuleActions.getAllClientUseRuleByDeptCd({
        compId: this.state.compId,
        deptCd: treeNode.get("deptCd")
      })
        .then(e => {
          DeptActions.getDeptInfo({
            compId: this.state.compId,
            deptCd: treeNode.get("deptCd")
          })
            .then(res => {
              treeNode = treeNode.set('expireDate', res.data.data[0].expireDate);
              this.props.DeptActions.showDialog({
                viewItem: treeNode,
                dialogType: DeptDialog.TYPE_EDIT
              });
            });
        })
        .catch(e => {});
    }
  };

  getSingleCheckedDept = () => {
    const checkedDeptCds = this.props.DeptProps.getIn([
      "viewItems",
      this.state.compId,
      "treeComp",
      "checked"
    ]);
    if (checkedDeptCds && checkedDeptCds.length > 0) {
      const deptCd = checkedDeptCds[0];
      if (deptCd !== undefined && deptCd !== "") {
        return this.props.DeptProps.getIn([
          "viewItems",
          this.state.compId,
          "treeComp",
          "treeData"
        ]).find(e => e.get("key") === deptCd);
      }
    }
    return null;
  };

  // create dept in tree
  handleCreateDept = event => {
    const { t, i18n } = this.props;
    const { DeptActions, GlobalActions } = this.props;
    const initDate = moment().add(7, "days");
    
    const checkedDept = this.getSingleCheckedDept();
    if (checkedDept !== undefined) {
      DeptActions.showDialog(
        {
          viewItem: {
            parentDeptCd: checkedDept.get("key"),
            parentExpireDate: checkedDept.get("expireDate"),
            expireDate: initDate.toJSON().slice(0, 10),
            deptCd: "",
            deptNm: ""
          },
          dialogType: DeptDialog.TYPE_ADD
      }, true);
    } else {
      GlobalActions.showElementMsg(
        event.currentTarget,
        t("msgSelectParentDept")
      );
    }
  };

  // check has group for delete
  isDeptRemovable = () => {
    let checkedDeptCd = this.props.DeptProps.getIn([
      "viewItems",
      this.state.compId,
      "treeComp",
      "checked"
    ]);
    if (checkedDeptCd && checkedDeptCd.length > 0) {
      // except default item
      checkedDeptCd = checkedDeptCd.filter(e => e !== "DEPTDEFAULT");
      return !(checkedDeptCd && checkedDeptCd.length > 0);
    } else {
      return true;
    }
  };

  isDeptOneSelect = () => {
    let checkedDeptCd = this.props.DeptProps.getIn([
      "viewItems",
      this.state.compId,
      "treeComp",
      "checked"
    ]);
    if (checkedDeptCd && checkedDeptCd.length > 0) {
      return !(checkedDeptCd && checkedDeptCd.length === 1);
    } else {
      return true;
    }
  };

  handleDeleteButtonForDept = () => {
    const { t, i18n } = this.props;
    let checkedDeptCd = this.props.DeptProps.getIn([
      "viewItems",
      this.state.compId,
      "treeComp",
      "checked"
    ]);
    if (checkedDeptCd && checkedDeptCd.length > 0) {
      // except default item
      checkedDeptCd = checkedDeptCd.filter(e => e !== "DEPTDEFAULT");

      this.props.GRConfirmActions.showCheckConfirm({
        confirmTitle: t("dtDeleteDept"),
        confirmMsg: t("msgDeletedDept", { deptCnt: checkedDeptCd.length }),
        confirmCheckMsg: t("lbDeleteInUser"),
        handleConfirmResult: (confirmValue, confirmObject, isChecked) => {
          if (confirmValue) {
            const {
              DeptProps,
              DeptActions,
              UserProps,
              UserActions
            } = this.props;

            if (checkedDeptCd && checkedDeptCd.length > 0) {
              DeptActions.deleteSelectedDeptData({
                deptCds: checkedDeptCd,
                compId: this.state.compId,
                isDeleteUser: isChecked
              }).then(reData => {
                // get parent index
                // NEED LOGIC UPGRADE FOR REFRESH TREE ~!!!!!!!
                this.handleResetTreeForDelete();
                // show client list in group.
                UserActions.readUserListPaged(
                  UserProps,
                  this.state.compId,
                  {
                    deptCd: [],
                    page: 0
                  },
                  { isResetSelect: true }
                );
              });
            }
          }
        },
        confirmObject: null
      });
    }
  };

  // multiple rule change in depts
  handleApplyMultiDept = event => {
    this.props.DeptActions.showMultiDialog({
      multiDialogType: DeptMultiDialog.TYPE_EDIT
    });
  };

  // add user in dept
  handleAddUserInDept = event => {
    const { t, i18n } = this.props;
    const deptCd = this.props.DeptProps.getIn([
      "viewItems",
      this.state.compId,
      "viewItem",
      "deptCd"
    ]);
    if (deptCd && deptCd !== "") {
      this.setState({
        isOpenUserSelect: true
      });
    } else {
      this.props.GlobalActions.showElementMsg(
        event.currentTarget,
        t("msgSelectDeptForAddUser")
      );
    }
  };

  isUserChecked = () => {
    const checkedIds = this.props.UserProps.getIn([
      "viewItems",
      this.state.compId,
      "checkedIds"
    ]);
    return !(checkedIds && checkedIds.size > 0);
  };

  handleMoveUserToDept = event => {
    const { t, i18n } = this.props;
    const checkedIds = this.props.UserProps.getIn([
      "viewItems",
      this.state.compId,
      "checkedIds"
    ]);
    if (checkedIds && checkedIds.size > 0) {
      this.setState({
        isOpenDeptSelect: true
      });
    } else {
      this.props.GlobalActions.showElementMsg(
        event.currentTarget,
        t("msgSelectUser")
      );
    }
  };

  // 사용자 정보 생성
  handleUserCreateData = event => {
    const { UserProps, GRConfirmActions } = this.props;
    const { t, i18n } = this.props;

    GRConfirmActions.showConfirm({
      confirmTitle: t("lbAddUserInfo"),
      confirmMsg: t("msgAddUserInfo"),
      handleConfirmResult: (confirmValue, paramObject) => {
        if (confirmValue) {
          const { UserProps, UserActions, DeptProps } = this.props;
          const {
            BrowserRuleProps,
            MediaRuleProps,
            SecurityRuleProps,
            SoftwareFilterProps,
            CtrlCenterItemProps,
            PolicyKitRuleProps,
            DesktopConfProps
          } = this.props;
          const selectedObjectIdName = [
            "viewItems",
            this.state.compId,
            "USER",
            "selectedOptionItemId"
          ];
          const editingItem = (paramObject) ? paramObject : null;
          if (editingItem !== undefined) {
            // user expire date
            let userExpireDate = "";
            if (
              editingItem.get("isUseExpire") !== undefined &&
              editingItem.get("isUseExpire") === "1"
            ) {
              userExpireDate = editingItem.get("expireDate");
            }
            // password expire date
            let passwordExpireDate = "";
            if (
              editingItem.get("isUsePasswordExpire") !== undefined &&
              editingItem.get("isUsePasswordExpire") === "1"
            ) {
              passwordExpireDate = editingItem.get("passwordExpireDate");
            }

            UserActions.createUserData({
              userId: UserProps.getIn(["editingItem", "userId"]),
              userPasswd: UserProps.getIn(["editingItem", "userPasswd"]),
              userNm: UserProps.getIn(["editingItem", "userNm"]),
              userEmail: UserProps.getIn(["editingItem", "userEmail"]),
              deptCd: UserProps.getIn(["editingItem", "deptCd"]),
              expireDate: userExpireDate,
              passwordExpireDate: passwordExpireDate,

              browserRuleId: BrowserRuleProps.getIn(selectedObjectIdName),
              mediaRuleId: MediaRuleProps.getIn(selectedObjectIdName),
              securityRuleId: SecurityRuleProps.getIn(selectedObjectIdName),
              filteredSoftwareRuleId: SoftwareFilterProps.getIn(
                selectedObjectIdName
              ),
              ctrlCenterItemRuleId: CtrlCenterItemProps.getIn(
                selectedObjectIdName
              ),
              policyKitRuleId: PolicyKitRuleProps.getIn(selectedObjectIdName),
              desktopConfId: DesktopConfProps.getIn(selectedObjectIdName)
            }).then(res => {
              if (res && res.status && res.status.result === "fail") {
                this.props.GRAlertActions.showAlert({
                  alertTitle: this.props.t("dtSystemError"),
                  alertMsg: res.status.message
                });
              }

              if (res && res.status && res.status.result === "success") {
                // change dept node info as user count
                this.handleResetTreeForEdit();
                // show users list in dept
                UserActions.readUserListPaged(
                  UserProps,
                  this.state.compId,
                  {
                    deptCd: DeptProps.getIn([
                      "viewItems",
                      this.state.compId,
                      "treeComp",
                      "checked"
                    ]),
                    page: 0
                  },
                  { isResetSelect: true }
                );
                // close dialog
                UserActions.closeDialog(true);
              }
            });
          }
        }
      },
      confirmObject: UserProps.get("editingItem")
    });
  };

  // delete
  handleUserDeleteData = (id) => {
    const { UserProps, GRConfirmActions } = this.props;
    const { t, i18n } = this.props;

    const viewItem = getRowObjectById(UserProps, this.state.compId, id, 'userId');
    GRConfirmActions.showConfirm({
      confirmTitle: t("lbDeleteUserInfo"),
      confirmMsg: t("msgDeleteUserInfo", {userNm: viewItem.get('userNm')}),
      handleConfirmResult: (confirmValue, confirmObject) => {
        if(confirmValue) {
          const { UserProps, UserActions, DeptProps } = this.props;
          UserActions.deleteUserData({
            compId: this.state.compId,
            userId: confirmObject.get('userId')
          }).then(res => {
            if (res && res.status && res.status.result === "fail") {
              this.props.GRAlertActions.showAlert({
                alertTitle: this.props.t("dtSystemError"),
                alertMsg: res.status.message
              });
            }
            if (res && res.status && res.status.result === "success") {
              // change dept node info as user count
              this.handleResetTreeForEdit();
              // show users list in dept
              UserActions.readUserListPaged(
                UserProps,
                this.state.compId,
                {
                  deptCd: DeptProps.getIn([
                    "viewItems",
                    this.state.compId,
                    "treeComp",
                    "checked"
                  ]),
                  page: 0
                },
                { isResetSelect: true }
              );
            }
          });
        }
      },
      confirmObject: viewItem
    });
  };

  // add user in dept - save
  handleUserSelectSave = checkedUserIds => {
    const { t, i18n } = this.props;
    const checkedDept = this.getSingleCheckedDept();
    if (checkedDept !== undefined) {
      this.props.GRConfirmActions.showConfirm({
        confirmTitle: t("lbChangeDeptForUser"),
        confirmMsg: t("msgChangeDeptForUser", {
          userCnt: checkedUserIds.size,
          deptNm: checkedDept.get("title")
        }),
        handleConfirmResult: (confirmValue, paramObject) => {
          if (confirmValue) {
            const {
              DeptActions,
              DeptProps,
              UserActions,
              UserProps
            } = this.props;
            DeptActions.createUsersInDept({
              deptCd: paramObject.selectedDeptCd,
              users: paramObject.checkedUserIds.join(",")
            }).then(res => {
              if (res.status && res.status && res.status.message) {
                this.props.GRAlertActions.showAlert({
                  alertTitle: t("dtSystemNotice"),
                  alertMsg: res.status.message
                });
              }
              if (res && res.status && res.status.result === "success") {
                // change dept node info as user count
                this.handleResetTreeForEdit();
                // show users list in dept
                UserActions.readUserListPaged(
                  UserProps,
                  this.state.compId,
                  {
                    deptCd: DeptProps.getIn([
                      "viewItems",
                      this.state.compId,
                      "treeComp",
                      "checked"
                    ]),
                    page: 0
                  },
                  { isResetSelect: true }
                );
                // close dialog
                this.setState({ isOpenUserSelect: false });
              }
            });
          }
        },
        confirmObject: {
          selectedDeptCd: checkedDept.get("key"),
          checkedUserIds: checkedUserIds
        }
      });
    }
  };

  handleDeptSelectSave = selectedDept => {
    const { t, i18n } = this.props;
    const checkedUserIds = this.props.UserProps.getIn([
      "viewItems",
      this.state.compId,
      "checkedIds"
    ]);
    const { GRConfirmActions } = this.props;
    GRConfirmActions.showConfirm({
      confirmTitle: t("lbChangeDeptForUser"),
      confirmMsg: t("msgChangeDeptForUser", {
        userCnt: checkedUserIds.size,
        deptNm: selectedDept.deptNm
      }),
      handleConfirmResult: (confirmValue, paramObject) => {
        if (confirmValue) {
          const { DeptActions, DeptProps, UserActions, UserProps } = this.props;
          DeptActions.createUsersInDept({
            deptCd: paramObject.selectedDeptCd,
            users: paramObject.selectedUsers.join(",")
          }).then(res => {
            if (res && res.status && res.status.result === "success") {
              // change dept node info as user count
              this.handleResetTreeForEdit();
              // show user list in dept.
              UserActions.readUserListPaged(UserProps, this.state.compId, {
                deptCd: DeptProps.getIn([
                  "viewItems",
                  this.state.compId,
                  "treeComp",
                  "checked"
                ]),
                page: 0
              });
            }
            // close dialog
            this.setState({ isOpenDeptSelect: false });
          });
        }
      },
      confirmObject: {
        selectedDeptCd: selectedDept.deptCd,
        selectedUsers: checkedUserIds
      }
    });
  };

  handleUserSelectionClose = () => {
    this.setState({
      isOpenUserSelect: false
    });
  };

  handleDeptSelectionClose = () => {
    this.setState({
      isOpenDeptSelect: false
    });
  };

  handleResetTreeForEdit = index => {
    // change group node info as client count
    this.props.DeptActions.getDeptNodeList({
      deptCds: this.props.DeptProps.getIn([
        "viewItems",
        this.state.compId,
        "treeComp",
        "treeData"
      ])
        .map(e => e.get("key"))
        .toJS(),
      compId: this.state.compId
    }).then(() => {
      if (index !== undefined) {
        const parentListItem = this.props.DeptProps.getIn([
          "viewItems",
          this.state.compId,
          "treeComp",
          "treeData",
          index
        ]);
        this.props.DeptActions.readChildrenDeptList(
          this.state.compId,
          parentListItem.get("key"),
          index
        );
      } else {
        this.props.DeptActions.readChildrenDeptList(
          this.state.compId,
          "DEPTDEFAULT",
          0
        );
      }
    });
  };

  handleResetTreeForDelete = index => {
    if (index !== undefined) {
      const parentListItem = this.props.DeptProps.getIn([
        "viewItems",
        this.state.compId,
        "treeComp",
        "treeData",
        index
      ]);
      this.props.DeptActions.readChildrenDeptList(
        this.state.compId,
        parentListItem.get("key"),
        index
      );
    } else {
      this.props.DeptActions.readChildrenDeptList(
        this.state.compId,
        "DEPTDEFAULT",
        -1
      );
    }
  };

  handleCreateUserButton = value => {
    const { UserActions } = this.props;
    const initDate = moment().add(7, "days");

    UserActions.showDialog(
      {
        ruleSelectedViewItem: {
          userId: "",
          userNm: "",
          userPasswd: "",
          showPasswd: false,
          userEmail: "",
          expireDate: initDate.toJSON().slice(0, 10),
          passwordExpireDate: initDate.toJSON().slice(0, 10)
        },
        ruleDialogType: UserDialog.TYPE_ADD
      },
      true
    );
  };

  render() {
    const { classes } = this.props;
    const { t, i18n } = this.props;
    const compId = this.state.compId;

    const selectedDept = this.props.DeptProps.getIn([
      "viewItems",
      this.state.compId,
      "treeComp",
      "selectedDept"
    ]);
    const isEditable =
      window.gpmsain === Constants.SUPER_RULECODE ? false : true;

    return (
      <React.Fragment>
        <GRPageHeader name={t(this.props.match.params.grMenuName)} />
        <GRPane>
          <Grid
            container
            spacing={8}
            alignItems="flex-start"
            direction="row"
            justify="space-between"
          >
            <Grid
              item
              xs={12}
              sm={4}
              lg={4}
              style={{ border: "1px solid #efefef", minWidth: 320 }}
            >
              {isEditable && (
                <Toolbar elevation={0} style={{ minHeight: 0, padding: 0 }}>
                  <Grid
                    container
                    spacing={0}
                    alignItems="center"
                    direction="row"
                    justify="space-between"
                  >
                    <Grid item>
                      <Tooltip title={t("ttAddNewDept")}>
                        <span>
                          <Button
                            className={classes.GRSmallButton}
                            variant="contained"
                            color="primary"
                            onClick={this.handleCreateDept}
                            disabled={this.isDeptOneSelect()}
                            style={{ marginRight: "5px" }}
                          >
                            <AddIcon />
                          </Button>
                        </span>
                      </Tooltip>
                      <Tooltip title={t("ttDeleteDept")}>
                        <span>
                          <Button
                            className={classes.GRSmallButton}
                            variant="contained"
                            color="primary"
                            onClick={this.handleDeleteButtonForDept}
                            disabled={this.isDeptRemovable()}
                          >
                            <RemoveIcon />
                          </Button>
                        </span>
                      </Tooltip>
                    </Grid>
                    <Grid item>
                      <Tooltip title={t("ttChangMultiDeptRule")}>
                        <span>
                          <Button
                            className={classes.GRIconSmallButton}
                            variant="contained"
                            color="primary"
                            onClick={this.handleApplyMultiDept}
                          >
                            <TuneIcon />
                          </Button>
                        </span>
                      </Tooltip>
                    </Grid>
                    <Grid item>
                      <Tooltip title={t("ttAddUserInDept")}>
                        <span>
                          <Button
                            className={classes.GRIconSmallButton}
                            variant="contained"
                            color="primary"
                            onClick={this.handleAddUserInDept}
                            disabled={this.isDeptOneSelect()}
                          >
                            <AddIcon />
                            <UserIcon />
                          </Button>
                        </span>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Toolbar>
              )}
              <DeptTreeComp
                compId={compId}
                selectorType="multiple"
                onCheck={this.handleCheckedDept}
                onSelect={this.handleSelectDept}
                onEdit={this.handleEditDept}
                isEnableEdit={isEditable}
                isActivable={true}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={8}
              lg={8}
              style={{ border: "1px solid #efefef" }}
            >
              {isEditable && (
                <Toolbar elevation={0} style={{ minHeight: 0, padding: 0 }}>
                  <Grid
                    container
                    spacing={8}
                    alignItems="flex-start"
                    direction="row"
                    justify="space-between"
                  >
                    <Grid item xs={12} sm={6} lg={6}>
                      <Tooltip title={t("ttMoveDept")}>
                        <span>
                          <Button
                            className={classes.GRIconSmallButton}
                            variant="contained"
                            color="primary"
                            onClick={this.handleMoveUserToDept}
                            disabled={this.isUserChecked()}
                          >
                            <MoveIcon />
                            <DeptIcon />
                          </Button>
                        </span>
                      </Tooltip>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      lg={6}
                      style={{ textAlign: "right" }}
                    >
                      <Tooltip title={t("ttAddUser")}>
                        <span>
                          <Button
                            className={classes.GRIconSmallButton}
                            variant="contained"
                            color="primary"
                            onClick={this.handleCreateUserButton}
                            style={{ marginLeft: "4px" }}
                          >
                            <AddIcon />
                            <AccountIcon />
                          </Button>
                        </span>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Toolbar>
              )}
              <UserListComp
                name="UserListComp"
                compId={compId}
                deptCd=""
                onSelect={this.handleSelectUser}
                isEnableEdit={isEditable}
                onMoveUserToDept={this.handleMoveUserToDept}
                onDeleteHandle={this.handleUserDeleteData}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              lg={12}
              style={{ border: "1px solid #efefef" }}
            >
              <UserSpec compId={compId} isEditable={isEditable} />
              <DeptSpec compId={compId} isEditable={isEditable} />
            </Grid>
          </Grid>
        </GRPane>

        <UserDialog
          compId={compId}
          onCreateHandle={this.handleUserCreateData}
        />
        <UserBasicDialog compId={compId} />

        <DeptDialog
          compId={compId}
          resetCallback={this.handleResetTreeForEdit}
        />
        <DeptMultiDialog compId={compId} />

        <UserSelectDialog
          isOpen={this.state.isOpenUserSelect}
          compId={compId}
          deptNm={selectedDept !== undefined ? selectedDept.get("deptNm") : ""}
          onSaveHandle={this.handleUserSelectSave}
          onClose={this.handleUserSelectionClose}
        />
        <DeptSelectDialog
          isOpen={this.state.isOpenDeptSelect}
          compId={compId}
          isShowCheck={false}
          onSaveHandle={this.handleDeptSelectSave}
          onClose={this.handleDeptSelectionClose}
        />

        <BrowserRuleDialog compId={compId} />
        <SecurityRuleDialog compId={compId} />
        <MediaRuleDialog compId={compId} />
        <SoftwareFilterDialog compId={compId} />
        <CtrlCenterItemDialog compId={compId} />
        <PolicyKitRuleDialog compId={compId} />
        <DesktopConfDialog compId={compId} isEnableDelete={false} />
        <DesktopAppDialog compId={compId} />

        <GRConfirm />
        <GRCheckConfirm />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  GlobalProps: state.GlobalModule,
  DeptProps: state.DeptModule,
  UserProps: state.UserModule,
  UserReqProps: state.UserReqModule,
  BrowserRuleProps: state.BrowserRuleModule,
  MediaRuleProps: state.MediaRuleModule,
  SecurityRuleProps: state.SecurityRuleModule,
  SoftwareFilterProps: state.SoftwareFilterModule,
  CtrlCenterItemProps: state.CtrlCenterItemModule,
  PolicyKitRuleProps: state.PolicyKitRuleModule,
  DesktopConfProps: state.DesktopConfModule
});

const mapDispatchToProps = dispatch => ({
  GlobalActions: bindActionCreators(GlobalActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),

  DeptActions: bindActionCreators(DeptActions, dispatch),
  UserActions: bindActionCreators(UserActions, dispatch),
  UserReqActions: bindActionCreators(UserReqActions, dispatch),

  TotalRuleActions: bindActionCreators(TotalRuleActions, dispatch),
  GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate("translations")(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(GRCommonStyle)(UserMasterManage))
);
