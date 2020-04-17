import React from 'react';
import MaterialTable from 'material-table';
import { API_RECORDS } from './global';
import $ from "jquery"
var createClass = require('create-react-class');

var createClass = require('create-react-class');

module.exports = createClass({
    getInitialState: function () {
        return { data: [], _isMounted: false, dburl: API_RECORDS, title: "PR Table" };
    },
    componentWillReceiveProps(nextProps) {
        this.setState({ data: nextProps.data });  
    },
    componentDidMount: function () {
        this.state._isMounted = true;
        this.setState({
            columns: this.props.columns,
            data: this.props.data
        });
        console.log("Table Component")
        console.log(this.props);
        console.log(this.state);
    },
    componentWillUnmount: function () {
        // Reset the isMounted flag so that the loadCommentsFromServer callback
        // stops requesting state updates when the commentList has been unmounted.
        // This switch is optional, but it gets rid of the warning triggered by
        // setting state on an unmounted component.
        // See https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
        this.state._isMounted = false;
    },
    updateDatabase: function(record) {
        $.ajax({
            url: this.state.dburl,
            dataType: 'json',
            type: 'POST',
            data: record,
        })
            .done(function (result) {
                console.log("Entry to Database Received")
                console.log(result);
            }.bind(this))
            .fail(function (xhr, status, errorThrown) {
                console.error(API_RECORDS, status, errorThrown.toString());
                this.setState({ submitted: "Table Addition Failed. Try again with a better connection." });
            }.bind(this));
    },
    render: function () {
        return (
            <MaterialTable
                title={this.state.title}
                columns={this.state.columns}
                data={this.state.data}
                options={{paging:false}}
                editable={{
                    onRowAdd: newData =>
                        new Promise(resolve => {
                            setTimeout(() => {
                                resolve();
                                this.setState(prevState => {
                                    console.log(prevState);
                                    console.log(prevState.data);
                                    const data = [...prevState.data];
                                    console.log(data);
                                    data.push(newData);
                                    this.updateDatabase(newData);
                                    return Object.assign(prevState, { data });
                                });
                            }, 600);
                        }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise(resolve => {
                            setTimeout(() => {
                                resolve();
                                if (oldData) {
                                    this.setState(prevState => {
                                        const data = [...prevState.data];
                                        data[data.indexOf(oldData)] = newData;
                                        this.updateDatabase(newData);
                                        return Object.assign(prevState, { data });
                                    });
                                }
                            }, 600);
                        }),
                    onRowDelete: oldData =>
                        new Promise(resolve => {
                            setTimeout(() => {
                                resolve();
                                this.setState(prevState => {
                                    const data = [...prevState.data];
                                    data.splice(data.indexOf(oldData), 1);
                                    return Object.assign(prevState, { data });
                                });
                            }, 600);
                        }),
                }}
            />
        );
    }
});