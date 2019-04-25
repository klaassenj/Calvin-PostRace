
import React from 'react';
import $ from 'jquery';
import TopNav from './topnav';
import { API_URL, POLL_INTERVAL } from './global';
import Record from './record';
var $TABLE = $('#table');
var $BTN = $('#export-btn');
var $EXPORT = $('#export');

$('.table-add').click(function () {
var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide table-line');
$TABLE.find('table').append($clone);
});

$('.table-remove').click(function () {
$(this).parents('tr').detach();
});

$('.table-up').click(function () {
var $row = $(this).parents('tr');
if ($row.index() === 1) return; // Don't go above the header
$row.prev().before($row.get(0));
});

$('.table-down').click(function () {
var $row = $(this).parents('tr');
$row.next().after($row.get(0));
});

$BTN.click(function () {
var $rows = $TABLE.find('tr:not(:hidden)');
var headers = [];
var data = [];

// Get the headers (add special header logic here)
$($rows.shift()).find('th:not(:empty)').each(function () {
headers.push($(this).text().toLowerCase());
});

// Turn all existing rows into a loopable array
$rows.each(function () {
var $td = $(this).find('td');
var h = {};

// Use the headers from earlier to name our hash keys
headers.forEach(function (header, i) {
h[header] = $td.eq(i).text();
});

data.push(h);
});

// Output the result
$EXPORT.text(JSON.stringify(data));
});


module.exports = React.createClass({
    getInitialState: function () {
        return { _isMounted: false, search: "", records: [] };
    },
    componentDidMount: function () {
        this.state.records.push({
            name: "Charlie Kornoelje",
            five: "15:58",
            ten: "33:06",
            fifteen: "4:17"
        });
        this.setState({ isMounted: true });
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
                url: "/api/records",
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
    createHtml: function () {
        return this.state.records.map(record => {
            return (<Record
                name={record.name}
                fifteen={record.fifteen}
                five={record.five}
                ten={record.ten}
                steeple={record.steeple}
            ></Record>);
        })
    },
    createRows: function () {
        return this.state.records.map(record => {
            return (
                <tr>
                    <td className="pt-3-half" contentEditable="false">{record.name}</td>
                    <td className="pt-3-half" contentEditable="true">{record.fifteen}</td>
                    <td className="pt-3-half" contentEditable="true">{record.five}</td>
                    <td className="pt-3-half" contentEditable="true">{record.ten}</td>
                    <td className="pt-3-half" contentEditable="true">{record.steeple}</td>
                </tr>
            );
        });
    },
    render: function () {
        var Records = this.createHtml();
        var tableRows = this.createRows();
        return (
            <div>
                <h1>Welcome to the PR Page!</h1>
                <TopNav></TopNav>
                <div className="container">
                    <div id="searchbar">
                        <input
                            id="name"
                            type="text"
                            placeholder="Search..."
                            onChange={this.handleSearchChange}
                        />
                    </div>
                    <div className="card">
                        <h3 className="card-header text-center font-weight-bold text-uppercase py-4">PR Table</h3>
                        <p>Edit the Table to reflect recent performances</p>
                        <div className="card-body">
                            <div id="table" className="table-editable">
                                <span className="table-add float-right mb-3 mr-2"><a href="#!" className="text-success"><i className="fas fa-plus fa-2x"
                                    aria-hidden="true"></i></a></span>
                                <table className="table table-bordered table-responsive-md table-striped text-center">
                                    <tr>
                                        <th className="text-center">Name</th>
                                        <th className="text-center">1500m</th>
                                        <th className="text-center">5000m</th>
                                        <th className="text-center">10000m</th>
                                        <th className="text-center">Steeple</th>
                                    </tr>
                                    {tableRows}
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
