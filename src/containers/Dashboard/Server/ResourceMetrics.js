import React, { Component } from "react";


import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import { Tooltip, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { translate } from "react-i18next";
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


class ResourceMetrics extends Component {

  constructor(props) {
    super(props);
  }
  
  getDataKey(resourceType) {
    switch(resourceType) {
      case "net_recv":
        return "recv";
      case "net_sent":
        return "sent";
      default:
        return "value";
    }
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
              value: Math.round(n.get("value") * 100) / 100,
            });
          }
        });
        return data;
      case "net_recv":
        statusInfo.map((n) => {
          if (n) {
            data.push({
              timestamp: n.get("timeStamp"),
              value: Math.round(n.get("recv") * 0.000001 * 100) / 100, //Bytes => MegaBytes
            });
          }
        });
        return data;
      case "net_sent":
        statusInfo.map((n) => {
          if (n) {
            data.push({
              timestamp: n.get("timeStamp"),
              value: Math.round(n.get("sent") * 0.000001 * 100) / 100, //Bytes => MegaBytes
            });
          }
        });
        return data;
    }
  }
  
  drawLineChart (resourceType, data) {
    if(resourceType === "net_recv" || resourceType === "net_sent") {
      return (
        <ResponsiveContainer width="100%" height="90%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 35, left: 35, bottom: 10 }}
          >
            <XAxis dataKey="timestamp" interval={4} ticks={Array.from({ length: 60 }, (_, index) => index)} tickFormatter={(tick) => `${tick}s`} />
-            <YAxis type="number" domain={["dataMin", "dataMax"]} tick={{fontSize: 12}} tickFormatter={(tick) => tick.length > 4 ? `${tick.substring(0, 4)}...MB` : `${tick}MB`} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line
              name={"Usage"}
              type="monotone"
              dataKey={"value"}
              stroke="#efa7a7"
            />
          </LineChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height="90%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 35, left: 35, bottom: 10 }}
          >
            <XAxis dataKey="timestamp" interval={4} ticks={Array.from({ length: 60 }, (_, index) => index)} tickFormatter={(tick) => `${tick}s`}  />
            <YAxis type="number" domain={["dataMin", "dataMax"]} tickFormatter={(tick) => tick.length > 4 ? `${tick.substring(0, 4)}...%` : `${tick}%`} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line
              name={"Usage"}
              type="monotone"
              dataKey={"value"}
              stroke="#efa7a7"
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }
  }

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
              {resourceType === "cpu"
                ? "CPU"
                : resourceType === "mem"
                ? "MEMORY"
                : resourceType === "net_recv" || resourceType === "net_sent"
                ? "NETWORK"
                : resourceType === "disk"
                ? "DISK"
                : ""}
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
              color={resourceType == "net_recv" ? "secondary" : "primary"}
              onClick={() => onClickChangeType("net_recv")}
            >
              NET_RECV
            </Button>
            <Button
              className={classes.GRIconSmallButton}
              style={{ minWidth: 25, marginRight: 10 }}
              variant="contained"
              color={resourceType == "net_sent" ? "secondary" : "primary"}
              onClick={() => onClickChangeType("net_sent")}
            >
              NET_SENT
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
