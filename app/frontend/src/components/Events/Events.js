import React, {Component} from 'react';
import {loadState} from '../../_core/localStorage'
import {Segment, Header,Table,Pagination,Grid} from 'semantic-ui-react';
import {connect} from 'react-redux';
import OneStar from '../../assets/onestar.png'
import TwoStar from '../../assets/twostar.png'
import ThreeStar from '../../assets/threestar.png'



import history from '../../_core/history';
import * as userActions from '../../actions/userActions';

class Events extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            events: [],
            numPages:0


        }


    }

    componentDidMount() {

        const localState = loadState();
        this.setState({user: localState.user});



    }
    componentWillMount() {
        this.getEvents();
    //alert(this.normalizeDate("2019-10-20T23:50:00.000Z"));
       // alert("here");
    }

    normalizeDate(date){
        let d=new Date(date);
        let month=d.getUTCMonth()+1;
        let day=d.getUTCDate();
        let year=d.getUTCFullYear();
        let time=d.getUTCHours()+"."+d.getUTCMinutes();
        let datetext = d.toTimeString();



        var dat = new Date(date);
        var formatOptions = {
            day:    '2-digit',
            month:  '2-digit',
            year:   'numeric',
            hour:   '2-digit',
            minute: '2-digit',
            hour12: true
        };
        var dateString = dat.toLocaleDateString('en-US', formatOptions);
// datestring is "20:32:01 GMT+0530 (India Standard Time)"
// Split with ' ' and we get: ["20:32:01", "GMT+0530", "(India", "Standard", "Time)"]
// Take the first value from array :)
        datetext = datetext.split(' ')[0];

        return dateString;
    }

    updateDates(){

        let newevents=this.state.events.slice();
        //alert(this.state.events.length+"afasfaed")
        var i;
        for(i=0;i<newevents.length;i++) {
            //alert(newevents[i].Date);
            let d=newevents[i].Date;
            newevents[i].Date=this.normalizeDate(d);
        }
        this.setState({events:newevents});

    }



    updatePage(e,data){

        this.props.events("?page="+data.activePage+"&limit=8").then(result=> {
                //alert(Object.keys(result.action.payload));
                this.setState({events:result.value.events},this.updateDates);

            }

        )
        //this.updateDates();
    }


    getEvents(){

        this.props.events("?page=1&limit=8").then(result=> {
               //alert(Object.keys(result.action.payload));
                this.setState({events:result.value.events},this.updateDates);
                //alert(this.state.events[0].Event)
                this.setState({numPages:result.value.totalNumberOfPages})
            }



        )
        //this.updateDates();
       /* this.props.events("/events?page=1&limit=10").then(result =>result.data.results.map(event=>({

                    name:'${event.Event}',
                    date:'${event.Date}'

                }))


        ).then(events=>{
            this.setState({events})
            }

        )
*/

    }

    render() {
        const {events}  = this.state;
        const len=events.length;


        return (

            len?(
        <Grid>
            <div className="four wide column"></div>
            <div className="ten wide column">
            <Segment style={{width:"800px"}} raised piled padded compact textAlign='left'>
                <Header textAlign='center'>
                    Events
                </Header>
                <table className="ui blue table">
                    <thead>
                    <tr>
                        <th>Event</th>
                        <th>Country</th>
                        <th>Date</th>
                        <th>Source</th>
                        <th>Importance</th>
                    </tr>
                    </thead>
                    <tbody>
                    {events.map(function(event) {

                        const imp=event.Importance;
                        var src;
                        if(imp==3){
                            src=ThreeStar;
                        }else if(imp==2){
                            src=TwoStar;
                        }else{
                            src=OneStar;
                        }

                        return(
                        <tr>
                            <td>
                                {event.Event}
                            </td>
                            <td>
                                {event.Country}
                            </td>
                            <td>
                                {event.Date}
                            </td>
                            <td>
                                {event.Source}
                            </td>
                            <td>
                                {<img style={{width:"50px"}} src={src} alt='threeStar'/>}
                            </td>
                        </tr>)
                    })}
                    </tbody>


                </table>
                {<img style={{width:"150px"}} />}
                <Pagination  defaultActivePage={1} totalPages={this.state.numPages}
                    onPageChange={this.updatePage.bind(this)}
                />

            </Segment>
            </div>
        </Grid>):(<h1 style={{color:"white"}}>Loading</h1>)


        )
    }
}

const dispatchToProps = dispatch => {
    return {
        events: params => dispatch(userActions.events(params))
    };
};

export default connect(null, dispatchToProps)(Events);

