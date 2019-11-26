import React, {Component} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {Search, Segment, Header, Grid, Label} from 'semantic-ui-react';

import * as searchActions from '../../actions/searchActions';
import history from "../../_core/history";

const categoryRenderer = ({ name, results }) => {
    if(results.length>0) {
        return <Label as='span' content={name} />
    } else {
        return null;
    }
};


const configureResults = (key, values) => {
    if(key === "users") {
        return values.map(res =>  {return {...res, title: res.name + " " + res.surname, price: res.predictionRate, description: res.location}})
    } else if(key === "events") {
        return values.map(res => { return {...res, title: res.Event, price: res.Importance, description: res.Country + " - " + res.Date}})
    } else if(key === "articles") {
        return values.map(res => { return {...res, title: res.title}})
    } else if(key === "trading-equipments") {
        return values.map(res=> {return {...res, title: res.from + "/" + res.to, price: res.rate}})
    }
};

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state= {
            isLoading: false,
            results: [],
            value: ""
        }
    }


    handleResultSelect = (e, { result }) => {
        console.log(result);
        if(result.Event) {
            history.push("/events/"+result.CalendarId);
        }
        if(result.text) {
            history.push("/articles/"+result._id);
        }
        if(result.from) {
            history.push({pathname: "/trading-equipment", state: {currency: result.from}});
        }
        if(result.surname) {
            history.push("/profile/"+result._id);
        }
    };

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value });

        setTimeout(() => {
            if (this.state.value.length < 1) {
                return this.setState({ isLoading: false, results: [], value: '' });
            } else {
                this.props.search({value}).then(result => {
                    const results = {};
                    Object.keys(result.action.payload).forEach(key => {
                        const finalResults = configureResults(key, result.action.payload[key]);
                        if(finalResults.length > 0) {
                            let name="";
                            if(key==="users") {
                                name="Users";
                            } else if(key==="trading-equipments") {
                                name="Trading Equipment";
                            } else if(key==="events") {
                                name="Events";
                            } else {
                                name="Articles";
                            }
                            results[key] = {name, results: finalResults};
                        }
                    });
                    this.setState({isLoading: false, results});
                })
            }
        }, 300)
    };

    render() {
        const { isLoading, value, results } = this.state;

        return (
                    <Search
                        category
                        categoryRenderer={categoryRenderer}
                        loading={isLoading}
                        onResultSelect={this.handleResultSelect}
                        onSearchChange={_.debounce(this.handleSearchChange, 500, {
                            leading: true,
                        })}
                        results={results}
                        value={value}
                        {...this.props}
                    />
        )
    }

}

const dispatchToProps = dispatch => {
    return {
        search: params => dispatch(searchActions.search(params))
    }
};

export default connect(null,dispatchToProps)(SearchBar);