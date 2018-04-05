import React from "react";

export const GrProps = (groupList) => ([
    {
      id: "clientStatus",
      label: "상태구분",
      type: "select",
      selectItems: [
        { id: "", value: "정상단말" },
        { id: "SECURE", value: "침해단말" },
        { id: "REVOKED", value: "해지단말" },
        { id: "ONLINE", value: "온라인" },
        { id: "ALL", value: "전체" }
      ]
    },
    {
      id: "clientGroup",
      label: "그룹선택",
      type: "select",
      selectItems: groupList
    },
    {
      id: "searchData",
      label: "검색",
      type: "input-search"
    }
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





