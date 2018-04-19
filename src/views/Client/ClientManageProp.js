import React from "react";

export const GrProps = (groupList, valueObject) => ([
    {
      type: "select-single",
      id: "clientStatus",
      label: "상태구분",
      valueObject: "clientStatus",
      selectItems: [
        { id: "", value: "정상단말", label: "정상단말" },
        { id: "SECURE", value: "침해단말", label: "침해단말" },
        { id: "REVOKED", value: "해지단말", label: "해지단말" },
        { id: "ONLINE", value: "온라인", label: "온라인" },
        { id: "ALL", value: "전체", label: "전체" }
      ],
    },
    // {
    //   type: "select-single",
    //   id: "clientGroup",
    //   label: "그룹선택",
    //   selectItems: groupList,
    // },
    // {
    //   type: "input-search",
    //   id: "searchData",
    //   label: "검색",
    // }
  ]);

export const GrGridColumns = 
    [
        {
            Header: '선택',
            accessor: 'ischeck',
        }, {
            Header: '상태',
            accessor: 'clientStatus'
        }, {
            Header: '단말아이디',
            accessor: 'clientId'
        }, {
            Header: '단말이름',
            accessor: 'clientName'
        }, {
            Header: '접속자',
            accessor: 'loginId'
        }, {
            Header: '단말그룹',
            accessor: 'clientGroupName'
        }, {
            Header: '등록일',
            accessor: 'regDate'
    }];


export const GrGridData = 
    [{
        ischeck: 'C',
        status: '정상',
        clientid: 'Client_002',
        clientname: '우리단말기',
        loginuser: '홍길동',
        clientgroup: '화이팅그룹',
        regdate: '2017-12-31 13:22',
      },{
        ischeck: 'C',
        status: '정상',
        clientid: 'Client_002',
        clientname: '우리단말기',
        loginuser: '홍길동',
        clientgroup: '화이팅그룹',
        regdate: '2017-12-31 13:22',
      },{
        ischeck: 'C',
        status: '정상',
        clientid: 'Client_002',
        clientname: '우리단말기',
        loginuser: '홍길동',
        clientgroup: '화이팅그룹',
        regdate: '2017-12-31 13:22',
      },{
        ischeck: 'C',
        status: '정상',
        clientid: 'Client_002',
        clientname: '우리단말기',
        loginuser: '홍길동',
        clientgroup: '화이팅그룹',
        regdate: '2017-12-31 13:22',
      },{
        ischeck: 'C',
        status: '정상',
        clientid: 'Client_002',
        clientname: '우리단말기',
        loginuser: '홍길동',
        clientgroup: '화이팅그룹',
        regdate: '2017-12-31 13:22',
      },{
        ischeck: 'C',
        status: '정상',
        clientid: 'Client_002',
        clientname: '우리단말기',
        loginuser: '홍길동',
        clientgroup: '화이팅그룹',
        regdate: '2017-12-31 13:22',
      },{
        ischeck: 'C',
        status: '정상',
        clientid: 'Client_002',
        clientname: '우리단말기',
        loginuser: '홍길동',
        clientgroup: '화이팅그룹',
        regdate: '2017-12-31 13:22',
      }
    ];





