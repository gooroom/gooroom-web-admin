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

import ReactTable from "react-table";
import "react-table/react-table.css";

import TextField from "material-ui/TextField";
import Select from "material-ui/Select";
import { MenuItem } from "material-ui/Menu";
import Input, { InputLabel } from "material-ui/Input";
import { FormControl, FormHelperText } from "material-ui/Form";


import Button from 'material-ui/Button';
import Search from '@material-ui/icons/Search';

const styles= theme => ({
  content: {
    height: "100%",
  },
  pageContent: {
    paddingTop: 2,
  },
  control: {
    marginTop: 0
  },
  formControl: {
    minWidth: 120,
    marginRight: "15px",
  },
  form: {
    marginBottom: 15
  },
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

class ClientManage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapse: true,
      loading: true,
      clientGroup: "",
      clientGroupOptionList: [],
      clientStatus: "",
      clientStatusItems: [
        { id: "", value: "정상단말", label: "정상단말" },
        { id: "SECURE", value: "침해단말", label: "침해단말" },
        { id: "REVOKED", value: "해지단말", label: "해지단말" },
        { id: "ONLINE", value: "온라인", label: "온라인" },
        { id: "ALL", value: "전체", label: "전체" }
      ],
      keyword: "",
      gridData: [],
    };

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    var that = this;
    axios({
      method: "post",
      url: "http://localhost:8080/gpms/readClientGroupList",
      config: { headers: { "Content-Type": "multipart/form-data" } },
      data: {}
    })
      .then(function(response) {
        if (response.data.data && response.data.data.length > 0) {
          const groupList = response.data.data.map(x => ({
            key: x.grpId,
            id: x.grpId,
            value: x.grpNm,
            label: x.grpNm,
          }));
          that.setState({ clientGroupOptionList: groupList });
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
    bodyFormData.set("start", "0");
    bodyFormData.set("length", "5");
    var that2 = this;
    axios({
      method: "post",
      url: "http://localhost:8080/gpms/readClientList",
      config: { headers: { "Content-Type": "multipart/form-data" } },
      data: bodyFormData
    })
      .then(function(response) {
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
    requestData(state.pageSize, state.page, state.sorted, state.filtered).then(
      res => {
        // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
        this.setState({
          data: res.rows,
          pages: res.pages,
          loading: false
        });
      }
    );
  }

  handleChangeSelect = event => {
    //console.log("### : "  + event);
    this.setState({ [event.target.name]: event.target.value });
  };
  
  handleChangeKeyword = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };


  render() {
    //console.log("-ClientManage.render-------------------------");
    const { classes } = this.props;
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
                  {this.state.clientStatusItems.map(x => (
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
                  onChange={this.handleChangeKeyword('keyword')}
                  margin="normal"
                />
              </FormControl>

              <Button className={classes.button} variant="raised" color="primary">
                <Search className={classes.leftIcon} />
                조회
              </Button>

            </form>

            <ReactTable
              data={this.state.gridData}
              columns={GrGridColumns}
              defaultPageSize={5}
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
