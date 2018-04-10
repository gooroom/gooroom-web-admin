import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";

import { grLayout } from "../../templates/default/GrLayout";
import { grColor } from "../../templates/default/GrColors";

import Card, {
  CardHeader,
  CardMedia,
  CardContent,
  CardActions
} from "material-ui/Card";

import GrOptions from "../../containers/GrOptions";
import GrPageHeader from "../../components/GrHeader/GrPageHeader";
import { GrProps, GrGridColumns, GrGridData } from "./ClientManageProp";

import axios from "axios";
import qs from "qs";

import ReactTable from "react-table";
import "react-table/react-table.css";

import TextField from "material-ui/TextField";
import Select from "material-ui/Select";
import { MenuItem } from "material-ui/Menu";
import Input, { InputLabel } from "material-ui/Input";
import { FormControl, FormHelperText } from "material-ui/Form";

import Button from "material-ui/Button";
import Search from "@material-ui/icons/Search";

const styles = theme => ({
  content: {
    height: "100%"
  },
  pageContent: {
    paddingTop: 2
  },
  control: {
    marginTop: 0
  },
  formControl: {
    minWidth: 120,
    marginRight: "15px"
  },
  form: {
    marginBottom: 15
  },

  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  }
});


const requestData = (pageSize, page, sorted, filtered) => {



  return new Promise((resolve, reject) => {


    console.log("pageSize : " + pageSize);
    console.log("page : " + page);
    console.log("sorted : " + sorted);
    console.log("filtered : " + filtered);


    //var that = this;
    let rawData = [];
    axios({
      method: "post",
      url: "http://localhost:8080/gpms/readClientList",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      transformRequest: [function (data, headers) {
        return qs.stringify(data);
      }],
      data: {
        start: "0",
        length: "5",
        searchKey: that.state.keyword,
        clientType: that.state.clientStatus,
        groupId: that.state.clientGroup,
      },
      withCredentials: true
    }).then(function(response) {

        if (response.data.data && response.data.data.length > 0) {
          const gridList = response.data.data.map(x => ({
            key: x.grpId,
            id: x.grpId,
            value: x.grpNm
          }));

          rawData = response.data.data;

          //const gridList2 = response.data.data;
          //that.setState({ clientListData: gridList2 });
        }

      })
      .catch(function(error) {
        console.log(error);
      });





    // You can retrieve your data however you want, in this case, we will just use some local data.
    let filteredData = rawData;

    // You must return an object containing the rows of the current page, and optionally the total pages number.
    const res = {
      rows: filteredData.slice(pageSize * page, pageSize * page + pageSize),
      pages: Math.ceil(filteredData.length / pageSize)
    };

    // Here we'll simulate a server response with 500ms of delay.
    setTimeout(() => resolve(res), 500);
  });
};


class ClientManage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      collapse: true,
      loading: true,

      clientGroup: "",
      clientGroupOptionList: [],
      clientStatus: "",
      clientStatusOptionList: [
        { id: "NORMAL", value: "NORMAL", label: "정상단말" },
        { id: "SECURE", value: "SECURE", label: "침해단말" },
        { id: "REVOKED", value: "REVOKED", label: "해지단말" },
        { id: "ONLINE", value: "ONLINE", label: "온라인" },
        { id: "ALL", value: "ALL", label: "전체" }
      ],
      keyword: "",

      clientListData: []
    };

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {

      var that = this;
  
      axios({
        method: "post",
        url: "http://localhost:8080/gpms/readClientGroupList",
        transformRequest: [function (data, headers) {
          return "";
        }],
        data: {
        },
        withCredentials: true
      })
        .then(function(response) {
          if (response.data.data && response.data.data.length > 0) {
            const groupList = response.data.data.map(x => ({
              key: x.grpId,
              id: x.grpId,
              value: x.grpId,
              label: x.grpNm
            }));
            that.setState({ clientGroupOptionList: groupList });
          }
        })
        .catch(function(error) {
          console.log(error);
        });

    //this.getClientData();
  }

  fetchData(state, instance) {

    this.setState({ loading: true });
    const that = this;
    axios({
      method: "post",
      url: "http://localhost:8080/gpms/readClientList",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      transformRequest: [function (data, headers) {
        return qs.stringify(data);
      }],
      data: {
        start: "0",
        length: "5",
        searchKey: that.state.keyword,
        clientType: that.state.clientStatus,
        groupId: that.state.clientGroup,
      },
      withCredentials: true
    }).then(function(response) {

        that.setState({ loading: false });

        if (response.data.data && response.data.data.length > 0) {
          const gridList = response.data.data.map(x => ({
            key: x.grpId,
            id: x.grpId,
            value: x.grpNm
          }));


          //const gridList2 = response.data.data;
          that.setState({ clientListData: response.data.data });
        }

      })
      .catch(function(error) {
        console.log(error);
      });

  }






  handleChangeSelect = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeKeyword = name => event => {
    this.setState({[name]: event.target.value});
  };

  render() {
    //console.log("-ClientManage.render-------------------------");
    const { classes } = this.props;
    const { clientListData, clientGroup, clientStatus, keyword, pages, loading } = this.state;
    //console.log(this.state.clientGroupOptionList);
    return (
      <div className={classes.root}>
        <Card className={classes.content}>
          <GrPageHeader path={this.props.location.pathname} />
          <CardContent className={classes.pageContent}>
            <form className={classes.form}>
              <FormControl className={classes.formControl} autoComplete="off">
                <InputLabel htmlFor="client-status">단말상태</InputLabel>
                <Select
                  value={this.state.clientStatus}
                  onChange={this.handleChangeSelect}
                  inputProps={{ name: "clientStatus", id: "client-status" }}
                >
                  {this.state.clientStatusOptionList.map(x => (
                    <MenuItem value={x.value} key={x.id}>
                      {x.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl className={classes.formControl} autoComplete="off">
                <InputLabel htmlFor="client-group">단말그룹</InputLabel>
                <Select
                  value={this.state.clientGroup}
                  onChange={this.handleChangeSelect}
                  inputProps={{ name: "clientGroup", id: "client-group" }}
                >
                  {this.state.clientGroupOptionList.map(x => (
                    <MenuItem value={x.value} key={x.id}>
                      {x.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl className={classes.formControl} autoComplete="off">
                <TextField
                  id="keyword"
                  label="검색어"
                  className={classes.textField}
                  value={this.state.keyword}
                  onChange={this.handleChangeKeyword("keyword")}
                  margin="normal"
                />
              </FormControl>

              <Button
                className={classes.button}
                variant="raised"
                color="primary"
                onClick={() => {
                  this.fetchData();
                }}
              >
                <Search className={classes.leftIcon} />
                조회
              </Button>
            </form>

            <ReactTable
              data={clientListData}
              columns={GrGridColumns}
              loading={loading}
              defaultPageSize={5}
              onFetchData={this.fetchData}
              
            />
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
