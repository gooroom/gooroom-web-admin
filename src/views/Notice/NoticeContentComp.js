import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate, Trans } from 'react-i18next';

import * as NoticeActions from 'modules/NoticeModule';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class NoticeContentComp extends Component {

    componentDidMount() {
    }

    render() {
        const { classes } = this.props;
        const { compId, NoticeProps } = this.props;
        const { t, i18n } = this.props;
        const contentHeight = { 5: '161px', 10: '321px', 25: '801px' };

        const informOpen = NoticeProps.getIn(['viewItems', compId, 'informOpen']);
        const viewItem = NoticeProps.getIn(['viewItems', compId, 'viewItem']);
        let rowPerPage = NoticeProps.getIn(['viewItems', compId, 'listParam', 'rowsPerPage']);
        if (!rowPerPage) rowPerPage = 5;

        return (
        <div>
            {/* data option area */}
            <Card className={classes.noticeContentCard}>
                <CardHeader 
                    classes={{
                        root: classes.noticeContentCardHeader,
                        title: classes.noticeContentCardHeaderTitle
                    }}
                    title={t('colContent')}
                />
                <CardContent className={classes.noticeContentCardContent} style={{ height: contentHeight[rowPerPage] }}>
                    {informOpen && viewItem && 
                        viewItem.get('content')
                            .replace(/(?:\r\n|\r|\n)/g, '\n')
                            .split('\n')
                            .map(function (line, idx) {
                                return (<span key={idx}>{line.replace(/\s/g, '\u00A0')}<br/></span>);
                            })
                    }
                </CardContent>
            </Card>
        </div>
        );
    }
}
const mapStateToProps = (state) => ({
    NoticeProps: state.NoticeModule
});
  
const mapDispatchToProps = (dispatch) => ({
    NoticeActions: bindActionCreators(NoticeActions, dispatch),
});
  
export default translate('translations')(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(NoticeContentComp)));