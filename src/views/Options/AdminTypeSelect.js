// import React, { Component } from "react";

// import InputLabel from "@material-ui/core/InputLabel";
// import Select from "@material-ui/core/Select";
// import MenuItem from "@material-ui/core/MenuItem";
// import { Map, List } from "immutable";
// import { translate, Trans } from "react-i18next";


// class AdminTypeSelect extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       data: Map({
//         adminTypeData: List([
//           Map({ typeId: "S", typeVal: "S", typeNm: "lbTotalAdmin" }),
//           Map({ typeId: "A", typeVal: "A", typeNm: "lbSiteAdmin" }),
//           Map({ typeId: "P", typeVal: "P", typeNm: "lbPartAdmin" }),
//           Map({ typeId: "ALL", typeVal: "ALL", typeNm: "stAll" })
//         ]),
//         selectedAdminType: 'ALL'
//       })
//     }
//   }
  
//   // Events...
//   handleChangeSelect = (event, child) => {
//     const { data } = this.state;
//     this.setState({
//       data: data.set('selectedAdminType', event.target.value)
//     });
//     this.props.onChangeSelect(event.target.value);
//   };

//   render() {
//     const { t, i18n } = this.props;

//     return (
//       <React.Fragment>
//       <InputLabel htmlFor="admin-type">관리자타입</InputLabel>
//       <Select
//         value={this.state.data.get('selectedAdminType')}
//         onChange={this.handleChangeSelect}
//       >
//         {this.state.data.get('adminTypeData').map(x => (
//           <MenuItem value={x.get('typeVal')} key={x.get('typeId')}>
//             {t(x.get('typeNm'))}
//           </MenuItem>
//         ))}
//       </Select>
//       </React.Fragment>
//     );
//   }
// }

// export default translate("translations")(AdminTypeSelect);



import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as CommonOptionActions from 'modules/CommonOptionModule';

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import { translate, Trans } from "react-i18next";

import FormControl from '@material-ui/core/FormControl';

class AdminTypeSelect extends Component {

  componentDidMount() {
    this.props.CommonOptionActions.changeSelectValue({
      name: 'selectedAdminType',
      value: {
        typeId: '',
        typeNm: ''
      }
    });
  }

  handleChangeSelect = event => {
    const { CommonOptionActions } = this.props;
    CommonOptionActions.changeSelectValue({
      name: 'selectedAdminType',
      value: {
        typeId: event.target.value,
        typeNm: event.target.name
      }
    });
    this.props.onChangeSelect(event, event.target.value);
  };

  render() {
    const { CommonOptionProps } = this.props;
    const { t, i18n } = this.props;

    return (
      <React.Fragment>
      <FormControl fullWidth={true}>
      <InputLabel htmlFor="admin-type">{t("lbAdminType")}</InputLabel>
      <Select
        value={CommonOptionProps.selectedAdminType.typeId}
        onChange={this.handleChangeSelect}
        inputProps={{name: 'clientStatus'}}
      >
        {CommonOptionProps.adminTypeData.map(x => (
          <MenuItem value={x.typeId} key={x.typeId}>
            {t(x.typeNm)}
          </MenuItem>
        ))}
      </Select>
      </FormControl>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  CommonOptionProps: state.CommonOptionModule
});

const mapDispatchToProps = (dispatch) => ({
  CommonOptionActions: bindActionCreators(CommonOptionActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(AdminTypeSelect));