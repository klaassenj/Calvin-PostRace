
import React from 'react';
import $ from 'jquery';
import TopNav from './topnav';
import { API_URL, POLL_INTERVAL } from './global';
var createClass = require('create-react-class');
import { API_RECORDS } from "./global";
import MaterialTable from "material-table";

import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };


module.exports = createClass({
    getInitialState: function () {
        return { _isMounted: false, 
            search: "", 
            records: [], 
            headers: ["Name", "1500m", "5k", "10k"],
            columns: [
                { title: "Name", field: "name" },
                { title: "1500m", field: "fifteen" },
                { title: "5k", field: "five" },
                { title: "10k", field: "ten" }
            ] };
    },
    componentDidMount: function () {
        console.log("Mounted");
        this.state._isMounted = true;
        this.loadPersonalRecords();
    },
    componentWillUnmount: function () {
        this.state._isMounted = false;
    },
    handleSearchChange: function (e) {
        this.setState({ search: e.target.value });
    },
    loadPersonalRecords: function () {
        if (this.state._isMounted) {
            $.ajax({
                url: API_RECORDS,
                dataType: 'json',
                cache: true
            })
                .done(function (loadedRecords) {
                    this.setState({ records: loadedRecords })
                    console.log("Content Loaded.");
                    console.log(this.state.records)
                }.bind(this))
                .fail(function (xhr, status, errorThrown) {
                    console.error(API_URL, status, errorThrown.toString());
                }.bind(this));
        }
    },
    render: function () {
        return (
            <div>
                <h1>Welcome to the PR Page!</h1>
                <TopNav></TopNav>
                <div className="container">
                    <div className="noTouching" style={{ maxWidth: "100%" }}>
                        <MaterialTable
                            icons={tableIcons}
                            columns={this.state.columns}
                            data={this.state.records}
                            title="PRs"
                        />
                    </div>
                </div>
            </div>
        );
    }
});
