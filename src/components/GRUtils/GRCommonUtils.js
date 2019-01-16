import React, { Component } from "react";
import NOR from "@material-ui/icons/PlayCircleFilledWhiteTwoTone";
import OFF from "@material-ui/icons/PauseCircleFilledTwoTone";
import VLT from "@material-ui/icons/Warning";
import RVK from "@material-ui/icons/DeleteForever";

export const getMergedObject = (source, param) => {
    let tempSource = source;
    if(source) {
        Object.assign(tempSource, param);
    } else {
        Object.assign({}, param);
    }
    return tempSource;
};

/**
 * Returns TRUE if the first specified array contains all elements
 * from the second one. FALSE otherwise.
 *
 * @param {array} superset
 * @param {array} subset
 *
 * @returns {boolean}
 */
export const arrayContainsArray = (superset, subset) => {

    if (0 === subset.length) {
        return 0;
    }

    if(subset.every(function (value) {
        return (superset.indexOf(value) >= 0);
    })) {
        return 100;
    } else {
        if(subset.some(function (value) {
            return (superset.indexOf(value) >= 0);
        })) {
            return 50;
        } else {
            return 0;
        }
    }
};

export const getMergedArray = (masterArray, newArray, isImport) => {

    if(isImport) {
        newArray.forEach((item) => {
            if(!masterArray.includes(item)) {
                masterArray.push(item);
            }
        });
    } else {
        let newMasterArray = [];
        masterArray.forEach((item) => {
            if(!newArray.includes(item)) {
                newMasterArray.push(item);
            }
        });
        masterArray = newMasterArray;
    }

    return masterArray;
};


export const getJobStatusToString = (status, t) => {

    let clientStatus = '';

    if(status && status.startsWith('R')) {
        clientStatus = t("stBeforeJob");  
    } else if(status && status.startsWith('C')) {
        clientStatus = t("stCompJob");  
    } else if(status && status.startsWith('D')) {
        clientStatus = t("stRunningJob");  
    } else if(status && status.startsWith('E')) {
        clientStatus = t("stFailJob");  
    } else if(status && status.startsWith('Q')) {
        clientStatus = t("stCancelJob");  
    }

    if(status && status.endsWith('K')) {
        clientStatus = t("stRevokeClient") + ' (' + clientStatus + ')';
    }

    return clientStatus;
};

export const formatBytes = (bytes, decimals) => {
    if(bytes == 0) return '0 Bytes';
    const k = 1024,
        dm = decimals <= 0 ? 0 : decimals || 2,
        sizes = ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i];
};

export const getClientStatusIcon = (status) => {

    if(status == 'OFF') {
        return <OFF style={{color:'gray'}} />;
    } else if(status == 'NOR') {
        return <NOR style={{color:'green'}} />;
    } else if(status == 'VLT') {
        return <VLT style={{color:'red'}} />;
    } else if(status == 'RVK') {
        return <RVK style={{color:'gray'}} />;
    }
};

