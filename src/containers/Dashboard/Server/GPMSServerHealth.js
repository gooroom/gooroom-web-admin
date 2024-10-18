import React from "react";
import { Grid, Typography, Card, CardContent } from "@material-ui/core";
import { formatDateToSimple } from "components/GRUtils/GRDates";
import { translate } from "react-i18next";

const GPMSServerHealth = ({ serverList, t, classes }) => {
  // Repository 서버 정보 추출
  const repoServers = serverList.filter(server => server.target === "repo");
  // DB 서버 정보 추출
  const dbServers = serverList.filter(server => server.target === "db");

  return (
    <Grid container spacing={24}>
      {/* Repository 서버 상태 */}
      <Grid item xs={6} style={{ marginBottom: "24px" }}>
        {repoServers.length > 0 ? (
          repoServers.map((repoServer, index) => (
            <Card key={repoServer.id || index} style={{ marginTop: 16 }}>
              <CardContent className={classes.cardContent}>
                <Typography variant="h6">
                  {t("intgSystSttsHealthMng", { target: "Repository" })}
                </Typography>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant="body2">{t("serverNameDot")}</Typography>
                    <Typography variant="body2">{t("repoUrlDot")}</Typography>
                    <Typography variant="body2">{t("repoDistDot")}</Typography>
                    <Typography variant="body2">{t("checkDateDot")}</Typography>
                    <Typography variant="body2">{t("healthStatusDot")}</Typography>
                    <Typography variant="body2">{t("statusCodeDot")}</Typography>
                    <Typography variant="body2">{t("noteDot")}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{repoServer.serverName}</Typography>
                    <Typography variant="body2">{repoServer.url}</Typography>
                    <Typography variant="body2">{repoServer.dist}</Typography>
                    <Typography variant="body2">
                      {formatDateToSimple(repoServer.updatedDateTime, "YYYY-MM-DD HH:mm:ss")}
                    </Typography>
                    <Typography variant="body2" style={{ color: repoServer.status === "NORMAL" ? "green" : "red" }}>
                      {repoServer.status === "NORMAL" ? t("stNormal") : t("error")}
                    </Typography>
                    <Typography variant="body2">{repoServer.httpStatus}</Typography>
                    <Typography variant="body2">{repoServer.note}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card style={{ marginTop: 16 }}>
            <CardContent className={classes.cardContent}>
              <Typography variant="h6">{t("intgSystSttsHealthMng", { target: "Repository" })}</Typography>
              <Typography variant="body2" color="textSecondary" style={{ marginTop: "8px" }}>
                {t("noRegServers", { target: "Repository" })}
              </Typography>
              <Typography variant="body2" color="textSecondary" style={{ marginTop: "4px" }}>
                {t("regInfo")}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Grid>

      {/* DB 서버 상태 */}
      <Grid item xs={6} style={{ marginBottom: "24px" }}>
        {dbServers.length > 0 ? (
          dbServers.map((dbServer, index) => (
            <Card key={dbServer.id || index} style={{ marginTop: 16 }}>
              <CardContent className={classes.cardContent}>
                <Typography variant="h6">{t("intgSystSttsHealthMng", { target: "DB" })}</Typography>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography variant="body2">{t("serverNameDot")}</Typography>
                    <Typography variant="body2">{t("serverLocationDot")}</Typography>
                    <Typography variant="body2">{t("sidDot")}</Typography>
                    <Typography variant="body2">{t("checkDateDot")}</Typography>
                    <Typography variant="body2">{t("dbconnectionDot")}</Typography>
                    {dbServer.dbCheckItems && dbServer.dbCheckItems.map((item, itemIndex) => (
                      <div key={item.id || itemIndex}>
                        <Typography variant="body2">{item.itemName}</Typography>
                      </div>
                    ))}
                    <Typography variant="body2">{t("noteDot")}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{dbServer.serverName}</Typography>
                    <Typography variant="body2">{dbServer.url}</Typography>
                    <Typography variant="body2">{dbServer.sid}</Typography>
                    <Typography variant="body2">
                      {formatDateToSimple(dbServer.updatedDateTime, "YYYY-MM-DD HH:mm:ss")}
                    </Typography>
                    <Typography variant="body2" style={{ color: dbServer.connection === "SUCCESS" ? "green" : "red" }}>
                      {dbServer.connection === "SUCCESS" ? t("connectionSc") : t("connectionEr")}
                    </Typography>
                    {dbServer.dbCheckItems && dbServer.dbCheckItems.map((item, itemIndex) => (
                      <div key={item.id || itemIndex}>
                        <Typography variant="body2">{item.result ? item.result : t("noResult")}</Typography>
                      </div>
                    ))}
                    <Typography variant="body2">{dbServer.note}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card style={{ marginTop: 16 }}>
            <CardContent className={classes.cardContent}>
              <Typography variant="h6">{t("intgSystSttsHealthMng", { target: "DB" })}</Typography>
              <Typography variant="body2" color="textSecondary" style={{ marginTop: "8px" }}>
                {t("noRegServers", { target: "DB" })}
              </Typography>
              <Typography variant="body2" color="textSecondary" style={{ marginTop: "4px" }}>
                {t("regInfo")}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Grid>
    </Grid>
  );
};

export default translate("translations")(GPMSServerHealth);
