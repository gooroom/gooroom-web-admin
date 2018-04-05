import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";

import { grLayout } from "../../templates/default/GrLayout";
import { grColor } from "../../templates/default/GrColors";
/*
import {
  Badge, Label, Table,
  Row, Col, Button, ButtonDropdown,
  DropdownToggle, DropdownMenu, DropdownItem,
  Modal, ModalHeader, ModalBody, ModalFooter, 
  Card, CardHeader, CardFooter, CardBody,
  Collapse,
  Form, FormGroup, FormText,
  Input, InputGroup, InputGroupAddon, InputGroupText,
  Pagination, PaginationItem, PaginationLink
} from 'reactstrap';
*/

import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';

import GrOptionContainer from "../../components/GROptions/GrOptionContainer";
import GrPageHeader from "../../components/GrHeader/GrPageHeader";
import {GrProps, GrGridColumns, GrGridData} from "./ClientManageProp";

import axios from "axios";

import ReactTable from 'react-table';
import "react-table/react-table.css";

const styles = {
  root: {
  },
  content: {
    height: "calc(100vh - " + grLayout.headerHeight + grLayout.breadcrumbHeight + ")",
    
  },
};

class ClientManage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapse: true,
      loading: true,
      groupOptionList: [],
      gridData: []
    };

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    var that = this;
    axios({
      method: 'post',
      url: 'http://localhost:8080/gpms/readClientGroupList',
      config: { headers: {'Content-Type': 'multipart/form-data' }},
      data: {}
    }).then(function(response) {
        if (response.data.data && response.data.data.length > 0) {
          const groupList = response.data.data.map(x => ({
            key: x.grpId,
            id: x.grpId,
            value: x.grpNm
          }));
          that.setState({ groupOptionList: groupList });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
    
   

    // axios.post('http://localhost:8080/gpms/readClientGroupList', {
    //   firstName: 'Fred',
    //   lastName: 'Flintstone'
    // })
    // .then(function (response) {
    //   console.log(response);
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });

      // select data
      var bodyFormData = new FormData();
      bodyFormData.set('start', '0');
      bodyFormData.set('length', '5');
      var that2 = this;
      axios({
        method: 'post',
        url: 'http://localhost:8080/gpms/readClientList',
        config: { headers: {'Content-Type': 'multipart/form-data' }},
        data: bodyFormData
      }).then(function(response) {
        if (response.data.data && response.data.data.length > 0) {
          const gridList = response.data.data.map(x => ({
            key: x.grpId,
            id: x.grpId,
            value: x.grpNm
          }));
          const gridList2 = response.data.data;
          that2.setState({ gridData: gridList2 });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  fetchData(state, instance) {
    // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
    // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
    this.setState({ loading: true });
    // Request the data however you want.  Here, we'll use our mocked service we created earlier
    requestData(
      state.pageSize,
      state.page,
      state.sorted,
      state.filtered
    ).then(res => {
      // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
      this.setState({
        data: res.rows,
        pages: res.pages,
        loading: false
      });
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root} >
        <Card className={classes.content}>
          <GrPageHeader path={this.props.location.pathname}/>
          <CardContent>
            
            <ReactTable data={this.state.gridData} columns={GrGridColumns} defaultPageSize={5} />
          </CardContent>
        </Card>
      </div>
    );
  }
}

ClientManage.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(ClientManage);