//Ken-Q Analysis
//Copyright (C) 2016 Shawn Banasick
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.


// JSlint declarations
/* global numeric, CENTROID, window, QAV, $, document, JQuery, evenRound, UTIL, localStorage, _ */

(function (PASTE, QAV, undefined) {


    // persist statements in PQMethod paste input section
    (function () {
        var input = document.getElementById('statementsInputBoxPqmethod');
        //retrieve analysisVariable
        input.value = localStorage.getItem("qavStatementsInputBoxPqmethod");

        $('#statementsInputBoxPqmethod').on('input propertychange change', function () {
            localStorage.setItem("qavStatementsInputBoxPqmethod", this.value);
        });
    })();



    PASTE.stageDataPqmethod = function () {
        var statements, i, j, sortStatement, statementInput;

        // get statements as array and store
        statements = PASTE.pullStatementsIntoAnalysis("statementsInputBoxPqmethod");
        QAV.setState("qavCurrentStatements", statements);
        // todo - add statements to stage textarea

        for (i = 0; i < statements.length; i++) {
            sortStatement = statements[i];
            $("#existingDatabaseStatementList").append("<li>" + sortStatement + "</li>");
        }

        // split into lines
        statementInput = document.getElementById("sortInputBox").value;
        var arr = statementInput.split(/\r\n|\r|\n/g);
        var array1 = arr.slice(0, arr.length);
        var projectTitleString = array1.shift();
        var sortNumberString = array1.shift();

        // parsing first line of PQMethod file to set qav variables
        var numberSorts = parseInt(projectTitleString.slice(3, 6)); // lipset 9

        QAV.setState("qavTotalNumberSorts", numberSorts);
        QAV.totalNumberSorts = numberSorts;

        var originalSortSize = parseInt(projectTitleString.slice(7, 9)); // lipset 33
        var qavProjectName3 = (projectTitleString.slice(10, 70));
        var qavProjectName2 = qavProjectName3.trim();
        var qavProjectName = sanitizeProjectName(qavProjectName2);
        QAV.setState("qavProjectName", qavProjectName);

        QAV.setState("qavTotalStatements", originalSortSize);
        QAV.setState("qavOriginalSortSize", originalSortSize);
        QAV.setState("originalSortSize", originalSortSize);

        // parsing and coercing second line of PQMethod file
        // warning -array temp1 has an extra "0" entry in position 0
        var temp1b = sortNumberString.replace(/\s\s/g, ' ');
        var temp1a = temp1b.split(" ");
        var temp1 = temp1a.map(Number);
        var pyramidShapeNumbers = temp1.slice(3, temp1.length);

        QAV.setState("qavPyramidShape", pyramidShapeNumbers);

        UTIL.calculateSortTriangleShape(pyramidShapeNumbers);

        var sortSize = ((originalSortSize * 2) + 10); // lipset 76
        var names = [];
        var sorts = [];

        // break text array into names text array and sorts text array
        _(array1).forEach(function (element) {
            if (element.length) {
                var nameFragment = element.slice(0, 8);
                names.push(nameFragment);
                var sortFragment = element.slice(10, sortSize);
                sorts.push(sortFragment);
            }
        }).value();

        QAV.setState("qavRespondentSortsFromDbStored", sorts);

        // to prevent errors in zScore calcs and issues with "." in datatables
        var names2 = UTIL.checkUniqueName(names);

        // set respondent names for later  todo - delete doubles
        QAV.setState("qavRespondentNames", names2);
        QAV.setState("respondentNames", names2);

        // format pasted data
        var sortsAsNumbers = CENTROID.convertSortsTextToNumbers(sorts, originalSortSize);

        for (j = 0; j < sortsAsNumbers.length; j++) {
            var sortItem = sortsAsNumbers[j];
            var respondent = names2[j];
            $("#existingDatabaseRespondentList").append("<li>" + respondent + "&nbsp;&nbsp;&nbsp" + sortItem + "</li>");
        }
    };

    /****************************************************************  view control
     ********* Pull variables helper functions ************************************
     ******************************************************************************/

    PASTE.pullStatementsIntoAnalysis = function (statementTextareaId) {

        var statementInput1 = document.getElementById(statementTextareaId).value;

        var statementInput = statementInput1.trim();
        var arr = statementInput.split(/\r\n|\r|\n/g);

        var cleanStatements = [];

        $.each(arr, function () {
            var temp1 = UTIL.sanitizeUserInputText(this);
            cleanStatements.push($.trim(temp1));
        });
        return cleanStatements;
    };

    // todo - check to see if this function is used anywhere
    PASTE.pullProjectNameIntoAnalysis = function (projectNameInputId) {
        var dataSetName = document.getElementById(projectNameInputId).value;
        return dataSetName;
    };

    function sanitizeProjectName(qavProjectName2) {
        if (qavProjectName2 === '') {
            return '_';
        }
        return qavProjectName2.replace(/[^a-zA-Z0-9.-]/g, function () {
            return '_'; // + match[0].charCodeAt(0).toString(16) + '_'; 
        });
    }

    // *******************************************************************  model
    // ***** Import Hand-Coded File *********************************************
    // **************************************************************************
    PASTE.filePickedTextPQM = function (e) {

        var files = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            $("#sortInputBox").val(data);
            localStorage.setItem("sortInputBox", data);

        }; // end of reader function
        reader.readAsText(files, "ASCII");
    };

    // ******************************************************************  model
    // ***** Import User Statements File ***************************************
    // *************************************************************************
    PASTE.filePickedTextSTA = function (e) {
        var files = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            $("#statementsInputBoxPqmethod").val(data);
            localStorage.setItem("qavStatementsInputBoxPqmethod", data);
        }; // end of reader function
        reader.readAsText(files, "ASCII");
    };

}(window.PASTE = window.PASTE || {}, QAV));