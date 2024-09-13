import React, { Component } from "react";
import { Map, List } from "immutable";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as GRConfirmActions from "modules/GRConfirmModule";
import * as GRAlertActions from "modules/GRAlertModule";

import { formatDateToSimple } from "components/GRUtils/GRDates";
import GRConfirm from "components/GRComponents/GRConfirm";
import GRCommonTableHead from "components/GRComponents/GRCommonTableHead";

import KeywordOption from "views/Options/KeywordOption";

import Grid from "@material-ui/core/Grid";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";

import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Search from "@material-ui/icons/Search";

import { InlineDatePicker } from "material-ui-pickers";

import { withStyles } from "@material-ui/core/styles";
import { GRCommonStyle } from "templates/styles/GRStyles";

import { requestPostAPI } from "components/GRUtils/GRRequester";
import { translate, Trans } from "react-i18next";
import { Card, Input, MenuItem, Select, Typography } from "@material-ui/core";
import clsx from "clsx";
import { findEnglishToTrans, findKoreanToTrans } from "ui/i18n";

const searchTarget = ["all", "accessIp", "actType", "actItem", "actData"];

class DividedAdminHistList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stateData: Map({
        listData: List([]),
        listParam: Map({
          adminId: props.adminId,
          keyword: "",
          fromDate: "",
          toDate: "",
          orderDir: "desc",
          orderColumn: "LOG_SEQ",
          page: 0,
          rowsPerPage: 10,
          rowsPerPageOptions: List([5, 10, 25]),
          rowsTotal: 0,
          rowsFiltered: 0,
          searchType: "all",
        }),
        checkedIds: List([]),
      }),
      selectedRow: -1,
    };
  }
  handleGetAdminHistList = (newListParam) => {
    requestPostAPI("readAdminActListPaged", {
      adminId: newListParam.get("adminId"),
      keyword: newListParam.get("keyword"),
      fromDate: newListParam.get("fromDate"),
      toDate: newListParam.get("toDate"),
      status: newListParam.get("status"),
      page: newListParam.get("page"),
      start: newListParam.get("page") * newListParam.get("rowsPerPage"),
      length: newListParam.get("rowsPerPage"),
      orderColumn: newListParam.get("orderColumn"),
      orderDir: newListParam.get("orderDir"),
      searchType: newListParam.get("searchType"),
    })
      .then((response) => {
        const { data, recordsFiltered, recordsTotal, draw, rowLength, orderColumn, orderDir, extend } = response.data;
        let fromDate = "";
        let toDate = "";
        if (extend && extend.length) {
          extend.forEach((n) => {
            if (n.name === "fromDate") {
              fromDate = n.value;
            } else if (n.name === "toDate") {
              toDate = n.value;
            }
          });
        }
        const { stateData } = this.state;
        this.setState({
          stateData: stateData
            .set(
              "listData",
              List(
                data.map((e) => {
                  return Map(e);
                })
              )
            )
            .set(
              "listParam",
              newListParam.merge({
                fromDate: fromDate,
                toDate: toDate,
                rowsFiltered: parseInt(recordsFiltered, 10),
                rowsTotal: parseInt(recordsTotal, 10),
                page: parseInt(draw, 10),
                rowsPerPage: parseInt(rowLength, 10),
                orderColumn: orderColumn,
                orderDir: orderDir,
              })
            ),
        });
      })
      .catch((error) => {});
  };

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  handleChangePage = (event, page) => {
    const { stateData } = this.state;
    const newListParam = stateData.get("listParam").merge({
      page: page,
    });
    this.handleGetAdminHistList(newListParam);
  };

  handleChangeRowsPerPage = (event) => {
    const { stateData } = this.state;
    const newListParam = stateData.get("listParam").merge({
      rowsPerPage: event.target.value,
      page: 0,
    });
    this.handleGetAdminHistList(newListParam);
  };

  handleChangeSort = (columnId, currOrderDir) => {
    const { stateData } = this.state;
    const newListParam = stateData.get("listParam").merge({
      orderColumn: columnId,
      orderDir: currOrderDir === "desc" ? "asc" : "desc",
    });
    this.handleGetAdminHistList(newListParam);
  };
  // .................................................

  handleSelectRow = (event, id) => {
    const { stateData } = this.state;
    const checkedIds = stateData.get("checkedIds");
    let newCheckedIds = null;
    if (checkedIds) {
      const indexNo = checkedIds.indexOf(id);
      if (indexNo > -1) {
        newCheckedIds = checkedIds.delete(indexNo);
      } else {
        newCheckedIds = checkedIds.push(id);
      }
    } else {
      newCheckedIds = List([id]);
    }
    this.setState({ stateData: stateData.set("checkedIds", newCheckedIds) });
    this.props.onSelectClient(newCheckedIds);
  };

  handleKeywordChange = (name, value) => {
    const { stateData } = this.state;
    const newListParam = stateData.get("listParam").merge({
      keyword: value,
      page: 0,
    });
    this.setState({
      stateData: stateData.set("listParam", newListParam),
    });
    // 아래 커멘트 제거시, 타이프 칠때마다 조회
    //this.handleGetAdminHistList(newListParam);
  };

  handleSelectBtnClick = () => {
    const { stateData } = this.state;
    const { i18n } = this.props;

    const searchType = stateData.getIn(["listParam", "searchType"]);
    const prevKeyword = stateData.getIn(["listParam", "keyword"]);
    let newSearchKeyword = "undefinedKeyword";

    if (searchType === "actItem") {
      if (i18n.language === "en") {
        newSearchKeyword = findEnglishToTrans(prevKeyword);
      } else {
        newSearchKeyword = findKoreanToTrans(prevKeyword);
      }
    } else if (searchType === "actType") {
      switch (prevKeyword) {
        case "login":
          newSearchKeyword = "L";
          break;
        case "logout":
          newSearchKeyword = "L";
          break;
        case "Get":
          newSearchKeyword = "R";
          break;
        case "Create":
          newSearchKeyword = "I";
          break;
        case "Update":
          newSearchKeyword = "U";
          break;
        case "Delete":
          newSearchKeyword = "D";
          break;
        case "Approval":
          newSearchKeyword = "A";
          break;
        case "Cancel":
          newSearchKeyword = "C";
          break;
        case "Page":
          newSearchKeyword = "M";
          break;
        case "Check":
          newSearchKeyword = "B";
          break;
        case "OTP":
          newSearchKeyword = "O";
          break;
        default:
          newSearchKeyword = "ETC";
      }
    } else {
      newSearchKeyword = prevKeyword;
    }
    const newListParam = stateData.get("listParam").set("keyword", newSearchKeyword);
    this.handleGetAdminHistList(newListParam);
  };

  handleClickItem = (type, clientId) => {
    // this.props.onClickItem(type, clientId);
  };

  handleDateChange = (date, name) => {
    const { stateData } = this.state;
    const newListParam = stateData.get("listParam").merge({
      [name]: date.format("YYYY-MM-DD"),
      page: 0,
    });
    this.setState({
      stateData: stateData.set("listParam", newListParam),
    });
  };

  handleShowDetailLog = (idx) => {
    const currentIdx = this.state.selectedRow;

    if (idx === currentIdx) {
      this.setState({ selectedRow: -1 });
    } else {
      this.setState({ selectedRow: idx });
    }
  };

  handleSearchTargetChange = (event) => {
    this.setState({ stateData: this.state.stateData.setIn(["listParam", "searchType"], event.target.value) });
  };

  isTrueChecker = (value) => {
    if (value === false || value == "0" || value === "" || value === null || value === undefined || Number.isNaN(value)) {
      return false;
    }

    if (Array.isArray(value) && value.length === 0) {
      return false;
    }

    if (value !== null && typeof value === "object" && Object.keys(value).length === 0) {
      return false;
    }

    return true;
  };

  render() {
    const { classes } = this.props;
    const { t, i18n } = this.props;
    const columnHeaders = [
      {
        id: "logSeq",
        isOrder: false,
        numeric: false,
        disablePadding: true,
        label: t("colLogNo"),
      },
      {
        id: "logDate",
        isOrder: false,
        numeric: false,
        disablePadding: true,
        label: t("colLogDate"),
      },
      {
        id: "logType",
        isOrder: false,
        numeric: false,
        disablePadding: true,
        label: t("colLogType"),
      },
      {
        id: "accessIp",
        isOrder: false,
        numeric: false,
        disablePadding: true,
        label: t("colAccessIp"),
      },
      {
        id: "actTarget",
        isOrder: false,
        numeric: false,
        disablePadding: true,
        label: t("colLogTarget"),
      },
      {
        id: "logItem",
        isOrder: false,
        numeric: false,
        disablePadding: true,
        label: t("colLogItem"),
      },
      {
        id: "isSuccess",
        isOrder: false,
        numeric: false,
        disablePadding: true,
        label: t("colLogDetail"),
      },
    ];

    const { selectedRow, stateData } = this.state;
    const listObj = stateData;
    const searchType = listObj.getIn(["listParam", "searchType"]);

    const ObjectTable = ({ data }) => {
      return (
        <table>
          <thead>
            <tr>
              <th>{t("colLogDetailKey")}</th>
              <th>{t("colLogDetailValue")}</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([key, value]) => (
              <tr key={key + value}>
                <td>{key}</td>
                {value !== null && typeof value === "object" ? <ObjectTable data={value} /> : value}
              </tr>
            ))}
          </tbody>
        </table>
      );
    };

    return (
      <div>
        {/* data option area */}
        <Grid container={true} spacing={8} alignItems="flex-end" direction="row" justify="space-between">
          <Grid item xs={2}>
            <InlineDatePicker
              label={t("searchStartDate")}
              format="YYYY-MM-DD"
              value={listObj && listObj.getIn(["listParam", "fromDate"]) ? listObj.getIn(["listParam", "fromDate"]) : "1999-01-01"}
              onChange={(date) => {
                this.handleDateChange(date, "fromDate");
              }}
              className={classes.fullWidth}
            />
          </Grid>
          <Grid item xs={2}>
            <InlineDatePicker
              label={t("searchEndDate")}
              format="YYYY-MM-DD"
              value={listObj && listObj.getIn(["listParam", "toDate"]) ? listObj.getIn(["listParam", "toDate"]) : "1999-01-01"}
              onChange={(date) => {
                this.handleDateChange(date, "toDate");
              }}
              className={classes.fullWidth}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth={true}>
              <KeywordOption paramName="keyword" handleKeywordChange={this.handleKeywordChange} handleSubmit={() => this.handleSelectBtnClick()} />
            </FormControl>
          </Grid>
          <Grid item xs={4} style={{ display: "flex", alignItems: "center", justifyContent: "end" }}>
            <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSelectBtnClick()}>
              <Search />
              {t("btnSearch")}
            </Button>
            <FormControl style={{ marginLeft: 16, width: 120 }} className={clsx(classes.formControl, classes.noLabel)}>
              <Select value={searchType} onChange={this.handleSearchTargetChange}>
                {searchTarget.map((type) => (
                  <MenuItem key={type} value={type}>{`${t(`lbl${type.slice(0, 1).toUpperCase()}${type.slice(1)}`)}`}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {listObj && (
          <Table>
            <GRCommonTableHead
              classes={classes}
              keyId="logDate"
              headFix={true}
              orderDir={listObj.getIn(["listParam", "orderDir"])}
              orderColumn={listObj.getIn(["listParam", "orderColumn"])}
              onRequestSort={this.handleChangeSort}
              columnData={columnHeaders}
            />
            <TableBody>
              {listObj.get("listData").map((n, idx) => {
                let actLabel = "";
                switch (n.get("actTp")) {
                  case "R":
                    actLabel = "Get";
                    break;
                  case "I":
                    actLabel = "Create";
                    break;
                  case "U":
                    actLabel = "Update";
                    break;
                  case "D":
                    actLabel = "Delete";
                    break;
                  case "B":
                    actLabel = "Check";
                    break;
                  case "A":
                    actLabel = "Approval";
                    break;
                  case "C":
                    actLabel = "Cancel";
                  case "M":
                    actLabel = "Page";
                  case "O":
                    actLabel = "OTP";
                    break;
                  case "L":
                    actLabel = n.get("actItem");
                    break;
                  default:
                    actLabel = n.get("actTp");
                    break;
                }

                let detailJson = { request: null, response: null };

                try {
                  detailJson = JSON.parse(n.get("actData"));
                } catch (err) {}
                console.log(detailJson);
                const request = detailJson.request;
                const response = detailJson.response;

                const resultInfoText = i18n.language === "en" ? `${t("logResultMsg")} ${t(n.get("actItem"))}` : `${t(n.get("actItem"))}${t("logResultMsg")}`;
                return (
                  <React.Fragment key={n.get("logSeq")}>
                    <TableRow hover onClick={() => this.handleShowDetailLog(idx)}>
                      <TableCell className={classes.grSmallAndClickCell} style={{ minWidth: 70 }}>
                        {n.get("logSeq")}
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickCell} style={{ minWidth: 80 }}>
                        {formatDateToSimple(n.get("actDt"), "YYYY-MM-DD")}
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickCell} style={{ minWidth: 50 }}>
                        {actLabel}
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickCell} style={{ minWidth: 90 }}>
                        {n.get("accessIp")}
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickCell} style={{ minWidth: 90 }}>
                        {n.get("actTarget")}
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickCell} style={{ minWidth: 160 }}>
                        {t(n.get("actItem"))}
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get("isSuccess") == "true" ? t("colLogSuccess") : t("colLogFail")}</TableCell>
                    </TableRow>
                    {idx === selectedRow && (
                      <TableRow onClick={() => this.handleShowDetailLog(idx)}>
                        <TableCell colSpan={"7"} style={{ padding: 16 }}>
                          <Card style={{ padding: 12, display: "flex", flexDirection: "column", gap: 12, cursor: "pointer" }}>
                            <Typography variant="h5">{resultInfoText}</Typography>
                            {this.isTrueChecker(request) && (
                              <div>
                                <Typography variant="h6">{t("lblLogRequestValue")}</Typography>
                                <ObjectTable data={request} />
                              </div>
                            )}
                            {this.isTrueChecker(response) && (
                              <div>
                                <Typography variant="h6">{t("lblLogResponseValue")}</Typography>
                                <ObjectTable data={response} />
                              </div>
                            )}
                            {!this.isTrueChecker(request) && !this.isTrueChecker(response) && <Typography variant="h6">{t("lblNoDataFound")}</Typography>}
                          </Card>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        )}
        {listObj && listObj.get("listData") && listObj.get("listData").size > 0 && (
          <TablePagination
            component="div"
            count={listObj.getIn(["listParam", "rowsFiltered"])}
            rowsPerPage={listObj.getIn(["listParam", "rowsPerPage"])}
            rowsPerPageOptions={listObj.getIn(["listParam", "rowsPerPageOptions"]).toJS()}
            page={listObj.getIn(["listParam", "page"])}
            labelDisplayedRows={() => {
              return "";
            }}
            backIconButtonProps={{
              "aria-label": "Previous Page",
            }}
            nextIconButtonProps={{
              "aria-label": "Next Page",
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        )}
        <GRConfirm />
        {/*<GRAlert /> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
  GRAlertActions: bindActionCreators(GRAlertActions, dispatch),
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DividedAdminHistList)));
