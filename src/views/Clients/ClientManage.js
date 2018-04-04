import React, { Component } from "react";
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

import GROptionContainer from "../../components/GROptions/GROptionContainer";
import GRPageHeader from "../../components/Header/GRPageHeader";
import {GRProps, GRGridColumns, GRGridData} from "./ClientManageProp";

import axios from "axios";

import ReactTable from 'react-table';
import "react-table/react-table.css";

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
    
    axios
      .get("http://localhost:8080/gpms/readClientGroupList")
      .then(function(response) {
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

    return (
      <div className="animated fadeIn">
            <Card>
              <CardHeader>
                <GRPageHeader path={this.props.location.pathname}/>
              </CardHeader>
              <CardContent>
                <GROptionContainer options={GRProps(this.state.groupOptionList)} />
                <ReactTable data={this.state.gridData} columns={GRGridColumns} defaultPageSize={5} />
              </CardContent>
            </Card>
      </div>
    );
  }
}

export default ClientManage;
