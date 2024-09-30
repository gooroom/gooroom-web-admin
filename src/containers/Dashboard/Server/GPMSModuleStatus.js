import React, { Component } from "react";

import { translate } from "react-i18next";

import { connect } from "react-redux";

import { Typography } from "@material-ui/core";

import { GPMSModuleType, GPMSModuleStatusType } from "modules/HealthModule";


class GPMSModuleStatus extends Component {
  render() {
    const { t, HealthState } = this.props;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 16,
          gap: 12,
        }}
      >
        <p style={{ margin: 8 }}>{t("lbGPMSModuleStatus")}</p>
        <div style={{ display: "flex", gap: 12 }}>
          {Object.values(GPMSModuleType).map((moduleType) => {
            const moduleData = HealthState.get(moduleType);
            const moduleStatus = moduleData ? moduleData.get("status") : null;
            return (
              <div
                key={moduleType}
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderStyle: "solid",
                  borderWidth: 1,
                  borderRadius: 4,
                  borderColor: "#0000003b",
                  padding: "6px 8px 6px 14px",
                  gap: 40,
                }}
              >
                <Typography>{moduleType}</Typography>

                <Typography
                  style={{
                    width: "105px",
                    padding: "4px 0px",
                    borderRadius: "4px",
                    textAlign: "center",
                    backgroundColor:
                      moduleStatus === GPMSModuleStatusType.ONLINE
                        ? "#1280E633"
                        : moduleStatus === GPMSModuleStatusType.OFFLINE
                        ? "#66666633"
                        : "#FF616133",

                    color:
                      moduleStatus === GPMSModuleStatusType.ONLINE
                        ? "#1280E6"
                        : moduleStatus === GPMSModuleStatusType.OFFLINE
                        ? "#666666"
                        : "#FF6161",
                  }}
                >
                  {moduleStatus === GPMSModuleStatusType.ONLINE
                    ? t("GPMSModuleOnline")
                    : moduleStatus === GPMSModuleStatusType.OFFLINE
                    ? t("GPMSModuleOffline")
                    : t("GPMSModuleError")}
                </Typography>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  HealthState: state.HealthModule,
});

export default translate("translations")(
  connect(mapStateToProps)(GPMSModuleStatus)
);
