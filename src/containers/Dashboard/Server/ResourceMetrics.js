import React, { Component, useCallback } from "react";

import * as ResourceMetricsActions from "modules/ResourceMetricsModule";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import { Tooltip, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { GRCommonStyle } from "templates/styles/GRStyles";
import { translate } from "react-i18next";


class ResourceMetrics extends Component {

  constructor(props) {
    super(props);
  }
  
  convertData(statusInfo, resourceType) {
    const data = [];
    switch (resourceType) {
      case "cpu":
      case "mem":
      case "disk":
        statusInfo.map((n) => {
          if (n) {
            data.push({
              timestamp: n.get("timeStamp"),
              // timestamp: n.get("timestamp"),
              value: Math.round(n.get("value") * 100) / 100,
            });
          }
        });
        return data;
      case "net":
        statusInfo.map((n) => {
          if (n) {
            data.push({
              timestamp: n.get("timeStamp"),
              // timestamp: n.get("timestamp"),
              recv: Math.round(n.get("recv") * 0.000001 * 100) / 100, //Bytes => MegaBytes
              sent: Math.round(n.get("sent") * 0.000001 * 100) / 100, //Bytes => MegaBytes
            });
          }
        });
        return data;
    }
  }

  drawLineChart (resourceType, data) {
    if (resourceType === "net") {
      return (
        <ResponsiveContainer width="100%">
          <LineChart
            data={data}
            // margin={{ top: 10, right: 35, left: 35, bottom: 10 }}
          >
            <XAxis dataKey="timestamp" />
            <YAxis type="number" domain={["dataMin", "dataMax"]} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            {/* {this.drawLineChart(resourceType)} */}
            <Line
              name={"recv"}
              type="monotone"
              dataKey="recv"
              stroke="#efa7a7"
            />
            <Line
              name={"sent"}
              type="monotone"
              dataKey="sent"
              stroke="#62b6e2"
            />
          </LineChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%">
          <LineChart
            data={data}
            // margin={{ top: 10, right: 35, left: 35, bottom: 10 }}
          >
            <XAxis dataKey="timestamp" />
            <YAxis type="number" domain={["dataMin", "dataMax"]} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            {/* {this.drawLineChart(resourceType)} */}
            <Line
              name={"Usage"}
              type="monotone"
              dataKey="value"
              stroke="#efa7a7"
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }
  };

  // drawAdditionalChart = (resourceType) => {
  //   return <Line name={"Usage2"} type="monotone" dataKey="sent" stroke="#efa7a7" />;
  // }

  render() {
    const { t, classes, statusInfo, onClickChangeType, resourceType } = this.props;

    let data = [];
    if (statusInfo) {
      data = this.convertData(statusInfo, resourceType);
    }

    return (
      <div style={{ height: 220, paddingTop: 10 }}>
        <Grid container spacing={0}>
          <Grid item xs={6}>
            <Typography style={{ margin: "2px 8px", fontWeight: "bold" }}>
              {t("lbGPMSResourceMetrics")} - 
              {resourceType == "cpu"
                ? "CPU"
                : resourceType == "mem"
                ? "MEMORY"
                : resourceType == "net"
                ? "NETWORK"
                : resourceType == "mem"
                ? "DISK"
                : ""}{" "}
            </Typography>
          </Grid>
          <Grid item xs={6} style={{ textAlign: "right" }}>
            <Button
              className={classes.GRIconSmallButton}
              style={{ minWidth: 25, marginRight: 10 }}
              variant="contained"
              color={resourceType == "cpu" ? "secondary" : "primary"}
              onClick={() => onClickChangeType("cpu")}
            >
              CPU
            </Button>
            <Button
              className={classes.GRIconSmallButton}
              style={{ minWidth: 25, marginRight: 10 }}
              variant="contained"
              color={resourceType == "mem" ? "secondary" : "primary"}
              onClick={() => onClickChangeType("mem")}
            >
              MEM
            </Button>
            <Button
              className={classes.GRIconSmallButton}
              style={{ minWidth: 25, marginRight: 10 }}
              variant="contained"
              color={resourceType == "net" ? "secondary" : "primary"}
              onClick={() => onClickChangeType("net")}
            >
              NET
            </Button>
            <Button
              className={classes.GRIconSmallButton}
              style={{ minWidth: 25, marginRight: 10 }}
              variant="contained"
              color={resourceType == "disk" ? "secondary" : "primary"}
              onClick={() => onClickChangeType("disk")}
            >
              DISK
            </Button>
          </Grid>
        </Grid>
        {statusInfo &&
          statusInfo.size > 0 &&
          this.drawLineChart(resourceType, data)}
      </div>
    );
  }
}

export default translate("translations")(withStyles(GRCommonStyle)(ResourceMetrics));
