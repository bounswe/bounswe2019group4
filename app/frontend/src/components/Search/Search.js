import React, {Component} from 'react';
import _ from 'lodash';
import {connect} from 'react-redux';
import {Search, Segment, Header, Grid, Label,Popup} from 'semantic-ui-react';

import * as searchActions from '../../actions/searchActions';
import history from "../../_core/history";
import {normalizeDateToTR} from "../Events/Events";

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
        return values.map(res => { return {...res, title: res.Event, price: res.Importance, description: res.Country + " - " + normalizeDateToTR(res.Date)}})
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
            value: "",
            noResult:false
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

        this.setState({  value,results:[],noResult:false });

    };

    search=()=>{
        this.setState({isLoading:true});
        let value=this.state.value;

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
                    if(Object.keys(results).length===0){
                        this.setState({noResult:true})
                    }
                })
            }

    }

    enterPressed=(e)=>{
        if (e.key === 'Enter') {
            this.search();
        }

    }
    render() {
        const { isLoading, value, results } = this.state;

        return (
            <Popup
                trigger={
                    <Search

                        style={{marginTop: 2}}
                        category
                        categoryRenderer={categoryRenderer}
                        loading={isLoading}
                        onResultSelect={this.handleResultSelect}
                        onSearchChange={this.handleSearchChange}
                        onKeyUp={this.enterPressed}
                        results={results}
                        showNoResults={false}
                        value={value}
                        {...this.props}
                    />
                }
             open={this.state.noResult}


            >
            No Results Found!
            </Popup>
        )
    }

}

const dispatchToProps = dispatch => {
    return {
        search: params => dispatch(searchActions.search(params))
    }
};

export default connect(null,dispatchToProps)(SearchBar);