
import { grLayout } from "templates/default/GRLayout";

export const GRCommonStyle = theme => ({

    // Full page. - main container
    fullRoot: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column"
    },
    appBody: {
        marginTop: grLayout.pageHeaderHeight,
        display: "flex",
        flexDirection: "row",
        flexGrow: 1,
        overflowX: "hidden",
    },
    fullMain: {
        marginRight: 0,
        marginLeft: grLayout.sideBarWidth,
        flex: 1,
        zIndex: 1200,
        minWidth: 0,
        transition: "margin-left 0.25s, margin-right 0.25s, width 0.25s, flex 0.25s",
        display: "block",
    },
    fullWideMain: {
        marginRight: 0,
        marginLeft: 0,
        flex: 1,
        zIndex: 1200,
        minWidth: 0,
        transition: "margin-left 0.25s, margin-right 0.25s, width 0.25s, flex 0.25s",
        display: "block",
    },


    // PAGE Header (global)
    headerRoot: {
        display: "flex",
        flexDirection: "row",
        zIndex: 1300,
        position: "fixed",
        height: grLayout.headerHeight,
        padding: 0,
        margin: 0,
        boxShadow: "none",
    }, 

    headerToolbar: {
        flexDirection: "row",
        minHeight: grLayout.headerHeight,
        width: "100%"
    },

    headerBrandLogo: {
        color: "white",
        width: "calc(" + grLayout.sideBarWidth + " - 24px)",
        paddingLeft: 0,
        paddingRight: 0
    },

    // MENU (use router)
    menuRoot: {
        transition: "left 0.25s, right 0.25s, width 0.25s",
        position: "relative",
        flexWrap: "wrap",
        overflowX: "hidden",
        overflowY: "auto",
        marginTop: 0,
        height:
            "calc(100vh - " +
            grLayout.headerHeight +
            " - " +
            grLayout.breadcrumbHeight +
            " - " +
            grLayout.footerHeight +
            ")",
    },

    // MENU Header
    menuHeaderRoot: {
        paddingBottom: 0,
        marginBottom: 20
    },

    // MENU Body
    menuBodyRoot: {
        marginLeft: 20,
        marginRight: 20,
        boxShadow: "none",
        backgroundColor: theme.palette.background.default
    },

    // MENU Footer
    menuFooterRoot: {
        textAlign: "right",
        padding: "0.5rem 1rem",
        height: grLayout.footerHeight,
        borderTop: "1px solid #a4b7c1"
    },
    

    // Breadcrumb
    breadcrumbRoot: {
        transition: "left 0.25s, right 0.25s, width 0.25s",
        position: "relative",
        borderBottom: "1px solid #a4b7c1",
        display: "flex",
        flexWrap: "wrap",
        padding: "0.75rem 1rem",
        marginTop: 0,
        marginBottom: 0,
        listStyle: "none",
        height: grLayout.breadcrumbHeight,
        alignItems: "center"
    },
    breadcrumbParentMenu: {
        color: "blue"
    },
    breadcrumbCurrentMenu: {
        color: "red"
    },

    // Rule Component
    ruleViewerCard: {
        border: "1px solid #efefef",
        backgroupColor: "#fefefe"
    },
    compTitle: {
        backgroundColor:"lightBlue",
        color:"blue",
        fontWeight:"bold"
    },
    compTitleForBasic: {
        backgroundColor:"lightPink",
        color:"red",
        fontWeight:"bold"
    },
    compTitleForUserRole: {
        backgroundColor:"Moccasin",
        color:"Peru",
        fontWeight:"bold"
    },
    compTitleForEmpty: {
        backgroundColor:"lightBlue",
        color:"white",
        fontWeight:"bold"
    },
    


    // TREE
    parentNodeClass: {
        color: "#59761E"
    },

    childNodeClass: {
        color: "#98CA32"
    },


    // Client Selecter (GRClientSelector)
    csRoot: {
        border: '0px solid gray',
        display: 'flex'
    },
    csGroupArea: {
        height: "100%",
        width: "30%",
        overflow: "auto"
    },
    csClientArea: {
        height: "100%",
        width: "70%",
        overflow: "auto"
    },
    csSelectItemList: {
        paddingTop: "0px",
        paddingBottom: "0px"
    },
    csSelectItem: {
        padding: "5px 0px 5px 0px"
    },
    csSelectCheck: {
        width: "24px",
        height: "24px"
    },



    // Client information dialog (ClientDialog)
    tabContainer: {
        margin: "0px 30px",
        minHeight: 500,
        minWidth: 500
    },


    // Client Profile Setter
    profileLabel: {
        height: "25px",
        marginTop: "10px"
    },
    profileItemRow: {
        marginTop: "10px"
    },

    // Register key manager - ??????????????????
    createButton: {
        paddingTop: 24
    },

    // Department manager
    deptTreeCard: {
        maxHeight: "300px"
    },
    deptInfoCard: {
        marginBottom: "0px"
    },
    deptUserCard: {
        marginTop: "20px"
    },
    deptTitle: {
        marginBottom: "16px",
        fontSize: "14px",
    },
    deptCd: {
        marginBottom: "12px"
    },
    



    // COMMON ----------------------------------------------------
    fullWidth: {
        width: "100%"
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    smallIconButton: {
        minWidth: '34px'
    },
    GRIconSmallButton: {
        padding: "0 5 0 0",
        minWidth: "48px",
        fontSize: "0.8125rem",
        minHeight: "24px"
    },
    popoverMsg: {
        margin: theme.spacing.unit * 2,
        color: theme.palette.error.light
    },

    // Dialog Container and row - common (containerClass)
    dialogContainer: {
        margin: "0px 30px",
        minHeight: 300,
        minWidth: 500
    },
    dialogItemRow: {
        marginTop: "0px",
    },
    dialogItemRowBig: {
        marginTop: "10px",
    },

    buttonInTableRow: {
        color: "darkgray",
        padding: "0px",
        minWidth: "0px",
        minHeight: "0px"
    },

    // table, tr, th, td
    grSmallAndHeaderCell: {
        paddingLeft: "0px",
        paddingRight: "0px",
    },
    grSmallAndClickCell: {
        padding: "0px",
        cursor: "pointer"
    },
    grObjInCell: {
        height: "inherit"
    },

    grSelectedRow: {
        backgroundColor: theme.palette.secondary.light + " !important"
    },

    root: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 48,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    },
    label: {
        textTransform: 'capitalize',
      },


});

