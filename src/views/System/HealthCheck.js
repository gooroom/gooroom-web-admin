import React, { Component, Fragment} from 'react';
import { Map } from 'immutable';

import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as HealthCheckActions from 'modules/HealthCheckModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import GRPageHeader from 'containers/GRContent/GRPageHeader';

import GRPane from 'containers/GRContent/GRPane';
import Grid from '@material-ui/core/Grid';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate } from "react-i18next";

import RepoServerRegisterModal from './RepoServerRegisterModal';
import DBServerRegisterModal from './DBServerRegisterModal';

class HealthCheck extends Component {

    constructor(props) {
        super(props);
        this.state = {
            serverList: [],  // 서버 목록을 관리하는 state
            modalOpen: false,  // 모달 열림 상태 관리
            dbModalOpen: false, // db모달
            stateData: Map({
            })
        };
    }

    componentDidMount() {
        this.loadServerList();
    }

    loadServerList = () => {
        const { HealthCheckActions, HealthCheckProps } = this.props; 
        HealthCheckActions.getServerList(HealthCheckProps, this.props.match.params.grMenuId)
            .then(response => {
            console.log("server data:", response);  // 서버에서 받아온 데이터를 출력
            this.setState({ serverList: response.data.data });  // 서버 데이터를 state에 저장
        })
    }

    handleRepoServerRegister = () => {
        this.setState({ modalOpen: true });
    }

    handleCloseModal = () => {
        this.setState({ modalOpen: false });
    }

    handleDbServerRegister = () => {
        this.setState({ dbModalOpen: true });
    };

    handleCloseDbModal = () => {
        this.setState({ dbModalOpen: false });
    };


    handleSubmitModal = (newServerData) => {
        // console.log("새 서버 데이터:", newServerData);
        this.loadServerList(); // 서버 등록 후 목록 재조회
        this.setState({ modalOpen: false });
    }


    deleteServerRegister = (server) => {
        const { HealthCheckActions } = this.props;
        
        const url = {url:server.url};
        const id = {id:server.id};
        HealthCheckActions.deleteRepoServer(id).then((response) => {
            this.setState({ serverList: response.data.data });
        });
    }

    getScheduleLabel = (value) => {
        const scheduleOptions = [
            { label: '1 min', value: 1 },
            { label: '3 min', value: 3 },
            { label: '5 min', value: 5 },
            { label: '10 min', value: 10 },
            { label: '15 min', value: 15 },
            { label: '20 min', value: 20 },
            { label: '30 min', value: 30 },
            { label: '1 hour', value: 60 }
        ];
        const option = scheduleOptions.find(option => option.value === value);
        return option ? option.label : value;
    };

    renderRepoServerList() {
        const { classes } = this.props;
        const { serverList } = this.state;
        const { t, i18n } = this.props;

        return (
            <div>
                {serverList
                    .filter((server) => server.target === 'repo')
                    .map((server, index) => (
                        <Card key={index} style={{ marginTop: 16 }}>
                            <CardContent>
                                <Grid container spacing={24} alignItems="center">
                                    <Grid item xs={3}>
                                        <Typography variant="body1">{t("serverName")}</Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <TextField value={server.serverName} fullWidth margin="normal" InputProps={{readOnly: true}} />
                                    </Grid>
 
                                    <Grid item xs={3}>
                                        <Typography variant="body1">{t("repoUrl")}</Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <TextField value={server.url} fullWidth margin="normal" InputProps={{readOnly: true}} />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography variant="body1">{t("repoDist")}</Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <TextField value={server.dist} fullWidth margin="normal" InputProps={{readOnly: true}} />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography variant="body1">{t("healthCheckSchedule")}</Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <TextField 
                                            value={this.getScheduleLabel(server.schedule)} 
                                            fullWidth margin="normal" 
                                            InputProps={{readOnly: true}} 
                                        />
                                    </Grid>

                                    {server.note && (
                                        <Fragment>
                                            <Grid item xs={3}>
                                                <Typography variant="body1">{t("note")}</Typography>
                                            </Grid>
                                            <Grid item xs={9}>
                                                <TextField value={server.note} fullWidth margin="normal" InputProps={{readOnly: true}} />
                                            </Grid>
                                        </Fragment>
                                    )}
                                </Grid>
                                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
                                    <Typography variant="body2" color="textSecondary">
                                        {t("dltnOptn")}
                                    </Typography>
                                    <Button variant="contained" color="secondary" style={{ marginLeft: 'auto' }} onClick={() => this.deleteServerRegister(server)}>
                                        {t("stDelete")}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                ))}
                <Button variant="contained" color="primary" style={{ marginTop: 16, width: '100%' }} onClick={this.handleRepoServerRegister}>
                    {t("registerServerInfoAdd", {target: "Repository"})}
                </Button>
            </div>
        );
    }

    renderDbServerList() {
        const { classes } = this.props;
        const { serverList } = this.state;
        const { t, i18n } = this.props;

        return (
            <div>
            {serverList
                .filter((server) => server.target === 'db') // target이 'db'인 서버만 필터링
                .map((server, index) => (
                    <Card key={index} style={{ marginTop: 16 }}>
                        <CardContent>
                            <Grid container spacing={24} alignItems="center">
                                
                                {/* Server Name and DB Type */}
                                <Grid item xs={3}>
                                    <Typography variant="body1">{t("serverName")}</Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <TextField value={server.serverName} fullWidth margin="normal" InputProps={{ readOnly: true }}  />
                                </Grid>
        
                                {/* Server Location */}
                                <Grid item xs={3}>
                                    <Typography variant="body1">{t("serverLocation")}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField value={server.url} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                </Grid>

                                {/* DB Type */}
                                <Grid item xs={2}>
                                    <Typography variant="body1">{t("dbType")}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField value={server.dbType} fullWidth margin="normal" InputProps={{ readOnly: true }}  />
                                </Grid>
        
                                {/* Health Check Schedule */}
                                <Grid item xs={3}>
                                    <Typography variant="body1">{t("healthCheckSchedule")}</Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <TextField 
                                        value={this.getScheduleLabel(server.schedule)} 
                                        fullWidth margin="normal" 
                                        InputProps={{ readOnly: true }} 
                                    />
                                </Grid>
        
                                {/* Note (optional) */}
                                {server.note && (
                                    <Fragment>
                                        <Grid item xs={3}>
                                            <Typography variant="body1">{t("note")}</Typography>
                                        </Grid>
                                        <Grid item xs={9}>
                                            <TextField value={server.note} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                                        </Grid>
                                    </Fragment>
                                )}
        
                                {/* DB Check Items */}
                                <Grid container spacing={8} key={index} style={{ marginBottom: '10px' }}>
                                    {/* Check Items 텍스트 */}
                                    <Grid item xs={3} style={{ paddingLeft: '16px' }}>
                                        <Typography variant="body1" style={{ marginTop: '16px'}}>Check Items</Typography>
                                    </Grid>
                                    
                                    {/* Memory Used와 같은 체크 항목들 */}
                                    <Grid item xs={9}>
                                        {server.dbCheckItems && server.dbCheckItems.map((item, index) => (
                                            <TextField
                                                key={index}
                                                value={item.itemName ? item.itemName : ""}
                                                fullWidth
                                                margin="normal"
                                                InputProps={{ readOnly: true }}
                                                style={{ paddingLeft: '8px'}}
                                            />
                                        ))}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
                                <Typography variant="body2" color="textSecondary">
                                    {t("dltnOptn")}
                                </Typography>
                                <Button variant="contained" color="secondary" style={{ marginLeft: 'auto' }} onClick={() => this.deleteServerRegister(server)}>
                                    {t("stDelete")}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            <Button variant="contained" color="primary" style={{ marginTop: 16, width: '100%' }} onClick={this.handleDbServerRegister}>
                {t("registerServerInfoAdd", {target: "DB"})}
            </Button>
        </div>
        
        );
    }

    render() {
        const { classes } = this.props;
        const { t, i18n } = this.props;
        const { serverList, modalOpen, dbModalOpen } = this.state;

        const isRepoServerListEmpty = !Array.isArray(serverList) || serverList.filter(server => server.target === "repo").length === 0;
        const isDbServerListEmpty = !Array.isArray(serverList) || serverList.filter((server) => server.target === 'db').length === 0;

        return (
            <React.Fragment>
                <GRPageHeader name={t(this.props.match.params.grMenuName)} />
                <GRPane>

                    <AppBar position="static" elevation={0} color="default">
                        <Toolbar variant="dense">
                            <div style={{ flexGrow: 1 }} />
                        </Toolbar> 
                    </AppBar>

                    <Grid container spacing={24}>
                        <Grid item xs={6} style={{ marginBottom: '24px' }}>
                            <Card style={{ marginTop: 16 }}>
                                <CardHeader style={{ paddingBottom: 0 }} title={t("repoServerMng")} subheader={t("repoServerMngDtl")}/>
                                <CardContent className={classes.cardContent}>
                                    { isRepoServerListEmpty ? (
                                        <div
                                        style={{
                                            backgroundColor: '#f5f5f5',
                                            padding: '16px',
                                            marginTop: '16px',
                                            borderRadius: '4px',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <Typography variant="body2" color="textSecondary" style={{ marginBottom: '16px' }}>
                                            {t("noRegisteredServers", {target: "Repository"})}
                                        </Typography>
                                        <Button variant="contained" color="primary" onClick={this.handleRepoServerRegister}>
                                            {t("registerSever", {target: "Repository"})}
                                        </Button>
                                    </div>
                                    ) : (
                                        this.renderRepoServerList()
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={6} style={{ marginBottom: '24px' }}>
                            <Card style={{ marginTop: 16 }}>
                                <CardHeader style={{ paddingBottom: 0 }} title={t("dbServerMng")} subheader={t("dbServerMngDtl")} />
                                <CardContent className={classes.cardContent}>
                                    {isDbServerListEmpty ? (
                                            <div
                                                style={{
                                                    backgroundColor: '#f5f5f5',
                                                    padding: '16px',
                                                    marginTop: '16px',
                                                    borderRadius: '4px',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <Typography variant="body2" color="textSecondary" style={{ marginBottom: '16px' }}>
                                                    {t("noRegisteredServers", {target: "DB"})}
                                                </Typography>
                                                <Button variant="contained" color="primary" onClick={this.handleDbServerRegister}>
                                                    {t("registerSever", {target: "DB"})}
                                                </Button>
                                            </div>
                                        ) : (
                                            this.renderDbServerList()
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    {/* 레포 서버 등록 모달 컴포넌트 */}
                    <RepoServerRegisterModal open={modalOpen} onClose={this.handleCloseModal} onSubmit={this.handleSubmitModal} />
                    {/* DB 서버 등록 모달 컴포넌트 */}
                    <DBServerRegisterModal open={dbModalOpen} onClose={this.handleCloseDbModal} onSubmit={this.handleSubmitModal} />
                
                </GRPane>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    HealthCheckProps: state.HealthCheckModule
});

const mapDispatchToProps = (dispatch) => ({
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    HealthCheckActions: bindActionCreators(HealthCheckActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(HealthCheck)));
