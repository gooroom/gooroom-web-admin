import React, { Component } from "react";
import PropTypes from 'prop-types';

import GRRuleCardHeader from 'components/GRComponents/GRRuleCardHeader';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';

import Button from '@material-ui/core/Button';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';

import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import GRItemIcon from '@material-ui/icons/Adjust';

import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import WifiIcon from '@material-ui/icons/Wifi';
import BluetoothIcon from '@material-ui/icons/Bluetooth';

import EditIcon from '@material-ui/icons/Edit';
import Radio from '@material-ui/core/Radio';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

class DividedAdminManageSpec extends Component {

  render() {

    const { classes, selectedItem } = this.props;
    const { t, i18n } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    return (
      <React.Fragment>
      {selectedItem &&
        <Card>
          <GRRuleCardHeader
            category={"관리자 정보 - 권한"} title={selectedItem.get('adminNm')} 
            subheader={selectedItem.get('adminId')}
            action={
              <div style={{paddingTop:16,paddingRight:24}}>
                <Button size="small" variant="outlined" color="primary" style={{minWidth:32}}
                  onClick={(event) => this.props.onClickEdit(event, selectedItem.get('adminId'))}
                ><EditIcon /></Button>
              </div>
            }
          />
          <CardContent style={{padding:10,width:'100%'}}>
{/*          
            <Grid container spacing={0}>
              {(selectedItem.get('isClientAdmin') === '1') && 
                <React.Fragment>
                  <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16}}>[ {"단말관리 권한정보"} ]</Grid>
                  <Grid item xs={4} className={classes.specTitle}>{bull} {"단말 신규 등록"}</Grid>
                  <Grid item xs={2} className={classes.specContent}>{(selectedItem.get('clientAdd') === '1') ? '가능' : '불가능'}</Grid>
                  <Grid item xs={4} className={classes.specTitle}>{bull} {"단말 폐기"}</Grid>
                  <Grid item xs={2} className={classes.specContent}>{(selectedItem.get('clientDelete') === '1') ? '가능' : '불가능'}</Grid>
                  <Grid item xs={4} className={classes.specTitle}>{bull} {"단말 이동 (단말그룹에서 제거및 이동)"}</Grid>
                  <Grid item xs={2} className={classes.specContent}>{(selectedItem.get('clientMove') === '1') ? '가능' : '불가능'}</Grid>
                  <Grid item xs={4} className={classes.specTitle}>{bull} {"단말정책 적용"}</Grid>
                  <Grid item xs={2} className={classes.specContent}>{(selectedItem.get('clientRule') === '1') ? '가능' : '불가능'}</Grid>
                </React.Fragment>
              }
              {(selectedItem.get('isClientAdmin') === '0') && 
                <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16,color:'lightGray'}}>[ <strike>{"단말관리 권한정보"}</strike> ]</Grid>
              }

              {(selectedItem.get('isUserAdmin') === '1') && 
                <React.Fragment>
                  <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16}}>[ {"사용자관리 권한정보"} ]</Grid>
                  <Grid item xs={4} className={classes.specTitle}>{bull} {"사용자 등록"}</Grid>
                  <Grid item xs={2} className={classes.specContent}>{(selectedItem.get('userAdd') === '1') ? '가능' : '불가능'}</Grid>
                  <Grid item xs={4} className={classes.specTitle}>{bull} {"사용자 제거"}</Grid>
                  <Grid item xs={2} className={classes.specContent}>{(selectedItem.get('userDelete') === '1') ? '가능' : '불가능'}</Grid>
                  <Grid item xs={4} className={classes.specTitle}>{bull} {"사용자 이동 및 조직에서 제거"}</Grid>
                  <Grid item xs={2} className={classes.specContent}>{(selectedItem.get('userMove') === '1') ? '가능' : '불가능'}</Grid>
                  <Grid item xs={4} className={classes.specTitle}>{bull} {"사용자 대상 사용 정책 적용"}</Grid>
                  <Grid item xs={2} className={classes.specContent}>{(selectedItem.get('userRule') === '1') ? '가능' : '불가능'}</Grid>
                </React.Fragment>
              }
              {(selectedItem.get('isUserAdmin') === '0') && 
                <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16,color:'lightGray'}}>[ <strike>{"사용자관리 권한정보"}</strike> ]</Grid>
              }

              {(selectedItem.get('isRuleAdmin') === '1') && 
                <React.Fragment>
                  <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16}}>[ {"정책관리 권한정보"} ]</Grid>
                  <Grid item xs={4} className={classes.specTitle}>{bull} {"단말 사용정책 등록,수정,삭제"}</Grid>
                  <Grid item xs={2} className={classes.specContent}>{(selectedItem.get('ruleEdit') === '1') ? '가능' : '불가능'}</Grid>
                  <Grid item xs={4} className={classes.specTitle}>{bull} {"사용자 대상 정책 적용"}</Grid>
                  <Grid item xs={2} className={classes.specContent}>{(selectedItem.get('ruleUser') === '1') ? '가능' : '불가능'}</Grid>
                  <Grid item xs={4} className={classes.specTitle}>{bull} {"단말대상 정책 적용"}</Grid>
                  <Grid item xs={2} className={classes.specContent}>{(selectedItem.get('ruleClient') === '1') ? '가능' : '불가능'}</Grid>
                </React.Fragment>
              }
              {(selectedItem.get('isRuleAdmin') === '0') && 
                <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16,color:'lightGray'}}>[ <strike>{"정책관리 권한정보"}</strike> ]</Grid>
              }

              {(selectedItem.get('isDesktopAdmin') === '1') && 
                <React.Fragment>
                  <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16}}>[ {"데스크톱환경관리 권한정보"} ]</Grid>
                  <Grid item xs={4} className={classes.specTitle}>{bull} {"데스크톱환경 등록,수정,삭제"}</Grid>
                  <Grid item xs={2} className={classes.specContent}>{(selectedItem.get('desktopEdit') === '1') ? '가능' : '불가능'}</Grid>
                  <Grid item xs={4} className={classes.specTitle}>{bull} {"사용자 대상 데스크톱환경 적용"}</Grid>
                  <Grid item xs={2} className={classes.specContent}>{(selectedItem.get('desktopUser') === '1') ? '가능' : '불가능'}</Grid>
                  <Grid item xs={4} className={classes.specTitle}>{bull} {"단말대상 데스크톱환경 적용"}</Grid>
                  <Grid item xs={2} className={classes.specContent}>{(selectedItem.get('desktopClient') === '1') ? '가능' : '불가능'}</Grid>
                </React.Fragment>
              }
              {(selectedItem.get('isDesktopAdmin') === '0') && 
                <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16,color:'lightGray'}}>[ <strike>{"데스크톱환경관리 권한정보"}</strike> ]</Grid>
              }

              {(selectedItem.get('isNoticeAdmin') === '1') && 
                <React.Fragment>
                  <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16}}>[ {"공지관리 권한정보"} ]</Grid>
                  <Grid item xs={4} className={classes.specTitle}>{bull} {"공지사항 등록,수정,삭제"}</Grid>
                  <Grid item xs={2} className={classes.specContent}>{(selectedItem.get('noticeEdit') === '1') ? '가능' : '불가능'}</Grid>
                  <Grid item xs={4} className={classes.specTitle}>{bull} {"사용자 대상 공지 게시"}</Grid>
                  <Grid item xs={2} className={classes.specContent}>{(selectedItem.get('noticeUser') === '1') ? '가능' : '불가능'}</Grid>
                  <Grid item xs={4} className={classes.specTitle}>{bull} {"단말대상 공지 게시"}</Grid>
                  <Grid item xs={2} className={classes.specContent}>{(selectedItem.get('noticeClient') === '1') ? '가능' : '불가능'}</Grid>
                </React.Fragment>
              }
              {(selectedItem.get('isNoticeAdmin') === '0') && 
                <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16,color:'lightGray'}}>[ <strike>{"공지관리 권한정보"}</strike> ]</Grid>
              }
            </Grid>
            <Divider style={{marginTop:20}} />
            <Grid container spacing={0}>
              {(selectedItem.get('deptInfoList') && selectedItem.get('deptInfoList').size > 0) &&
              <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16}}>[ {"관리대상 조직정보"} - {"대상수"} : {selectedItem.get('deptInfoList').size} ea ]</Grid>
              }
              {(selectedItem.get('deptInfoList')) && selectedItem.get('deptInfoList').map((n, i) => (
                <React.Fragment key={n.get('value')}>
                  <Grid item xs={3} className={classes.specTitle}>( {(i + 1)} ) {"조직이름 / 조직아이디"}</Grid>
                  <Grid item xs={3} className={classes.specContent}>{n.get('name')} / {n.get('value')}</Grid>
                </React.Fragment>
              ))}
              {(selectedItem.get('deptInfoList') == null || selectedItem.get('deptInfoList').size < 1) &&
                <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16,color:'lightGray'}}>[ <strike>{"관리대상 조직정보"}</strike> ]</Grid>
              }
            </Grid>
            <Grid container spacing={0}>
              {(selectedItem.get('grpInfoList') && selectedItem.get('grpInfoList').size > 0) &&
              <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16}}>[ {"관리대상 단말그룹정보"} - {"대상수"} : {selectedItem.get('grpInfoList').size} ea ]</Grid>
              }
              {(selectedItem.get('grpInfoList')) && selectedItem.get('grpInfoList').map((n, i) => (
                <React.Fragment key={n.get('name')}>
                  <Grid item xs={3} className={classes.specTitle}>( {(i + 1)} ) {"단말이름 / 단말아이디"}</Grid>
                  <Grid item xs={3} className={classes.specContent}>{n.get('name')} / {n.get('value')}</Grid>
                </React.Fragment>
              ))}
              {(selectedItem.get('grpInfoList') == null || selectedItem.get('grpInfoList').size < 1) &&
                <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16,color:'lightGray'}}>[ <strike>{"관리대상 단말그룹정보"}</strike> ]</Grid>
              }
            </Grid>
*/}            
            <Grid container spacing={0}>
              {(selectedItem.get('connIps') && selectedItem.get('connIps').size > 0) &&
              <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16}}>[ {"접속가능 아이피"} ]</Grid>
              }
              {(selectedItem.get('connIps')) && selectedItem.get('connIps').map((n, i) => (
                <React.Fragment key={n}>
                  <Grid item xs={3} className={classes.specTitle}>( {(i + 1)} ) {"아이피(IP)"}</Grid>
                  <Grid item xs={3} className={classes.specContent}>{n}</Grid>
                </React.Fragment>
              ))}
              {(selectedItem.get('connIps') == null || selectedItem.get('connIps').size < 1) &&
                <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16,color:'lightGray'}}>[ <strike>{"접속가능 아이피"}</strike> ]</Grid>
              }
            </Grid>
          </CardContent>
        </Card>
      }
      </React.Fragment>
    );

  }
}

export default translate("translations")(withStyles(GRCommonStyle)(DividedAdminManageSpec));
