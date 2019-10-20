import React, {Component} from 'react';
import {loadState} from '../../_core/localStorage'
import {Segment, Header,Table,Pagination} from 'semantic-ui-react';
import {connect} from 'react-redux';

import history from '../../_core/history';
import * as userActions from '../../actions/userActions';

class Events extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            eve: {}

        }


    }

    componentDidMount() {
        const localState = loadState();
        this.setState({user: localState.user});
        this.getEvents();
    }


    getEvents(){

        this.props.events("/events?page=1&limit=10").then(result=> {

                this.setState({eve:result});
            }

        )
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
        const  {eve}  = this.state;
        return (

            <Segment raised piled padded compact textAlign='left' >
                <Header textAlign='center'>
                    Events
                </Header>
                <table class="ui red table" >
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
                        <td>
                            {eve.eventsInPage}
                        </td>
                        <td>
                            Country
                        </td>
                        <td>
                            Date
                        </td>
                        <td>
                            Source
                        </td>
                        <td>
                            Importance
                        </td>
                    </tbody>


                </table>
                <Pagination defaultActivePage={5} totalPages={10} />

            </Segment>



        )
    }
}

const dispatchToProps = dispatch => {
    return {
        events: params => dispatch(userActions.events(params))
    };
};

export default connect(null, dispatchToProps)(Events);

