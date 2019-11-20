import React, {Component} from 'react';
import {loadState} from '../../_core/localStorage'
import {Header, Icon, Pagination, Segment,Dropdown} from 'semantic-ui-react';
import {connect} from 'react-redux';
import OneStar from '../../assets/onestar.png'
import TwoStar from '../../assets/twostar.png'
import ThreeStar from '../../assets/threestar.png'
import {Link} from 'react-router-dom'
import * as userActions from '../../actions/userActions';
import Loading from "../Loading";


class Events extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            events: [],
            events2:[],
            shown:[],
            shownPage:1,
            totalNumOfEvents:0,
            eventPerPage:8,
            dateDir:false,
            impDir:false,
            dropdownItems:[],
            dropdown2Items:[],
            dropdown3Items:[
                {key:1,value:1,text:1},
                {key:2,value:2,text:2},
                {key:3,value:3,text:3}
            ],
            drCo:[],
            drEv:[],
            drImp:[],
            loading:false



        }


    }

    async componentDidMount() {

        const localState = loadState();
        this.setState({user: localState.user});
        await this.getEvents();
        this.setShownEvents();
        this.sortEventsByDate();

    }

    getCountriesForDropdown=()=>{
        let dropdownItems=[];
        let key=1;
        for(let i of this.state.events ){
            let check=false;
            for(let j of dropdownItems){
                if(j.value.trim()===i.Country.trim()){
                    check=true;
                    break;
                }
            }
            if(!check){
                let newitem={
                    key:key,
                    text:i.Country,
                    value:i.Country

                };
                dropdownItems.push(newitem);
                key++;
            }
        }
        dropdownItems.sort((a,b)=>{
            return ('' + a.value).localeCompare(b.value);
        });
        this.setState({dropdownItems:dropdownItems});
    };
    getEventsForDropdown=()=>{
        let dropdownItems=[];
        let key=1;
        for(let i of this.state.events ){
            let check=false;
            for(let j of dropdownItems){
                if(j.value.trim()===i.Event.trim()){
                    check=true;
                    break;
                }
            }
            if(!check){
                let newitem={
                    key:key,
                    text:i.Event,
                    value:i.Event

                };
                dropdownItems.push(newitem);
                key++;
            }
        }
        dropdownItems.sort((a,b)=>{
            return ('' + a.value).localeCompare(b.value);
        });
        this.setState({dropdown2Items:dropdownItems});
    };

    setShownEvents(){

        let arr=this.state.events2.slice((this.state.shownPage-1)*this.state.eventPerPage,(this.state.shownPage)*this.state.eventPerPage);

        this.setState({shown:arr});

    }

    async getEvents(){  //alert(Object.keys(result.action.payload));
        this.setState({loading:true});
        await this.props.events("?page=1&limit=1").then(result=>{

            let a=result.value.totalNumberOfEvents;
            this.setState({totalNumOfEvents:a});
            this.setState({numPages:Math.floor((a-1)/this.state.eventPerPage)+1});
        }).then(async()=> {


            await this.props.events("?page=1&limit=" + this.state.totalNumOfEvents).then(result => {

                this.setState({events: result.value.events}, this.updateDates);


            }).then(()=>{
                this.setState({events2:this.state.events});
                this.getCountriesForDropdown();
                this.getEventsForDropdown();
                this.setState({loading:false});
            })
        });
    }
    changeEvents2=async (list)=>{
        await this.setState({events2:list},()=>this.setState({numPages:Math.floor((this.state.events2.length-1)/this.state.eventPerPage)+1}))
    };

    sortfunc=(f,g)=>{
        let dateDir=this.state.dateDir;
        let a=new Date(f.normalDate);
        let b=new Date(g.normalDate);
        let c=f.Importance;
        let d=g.Importance;
        if(a.getTime()===b.getTime()) {
            return d-c;
        }
        /*
        let a=new Date(f.normalDate);
        let b=new Date(g.normalDate);
        let c=f.Importance;
        let d=g.Importance;
        if(a.getTime()===b.getTime()){

            if(!impDir){
                return d-c;
            }else{
                return c-d;
            }
        }else{
            return dateDir?a-b:b-a;
        }*/
        return dateDir?a-b:b-a;

    };
    sortfunc2=(f,g)=>{
        let impDir=this.state.impDir;
        let c=f.Importance;
        let d=g.Importance;
        let a=new Date(f.normalDate);
        let b=new Date(g.normalDate);
        if(c===d){
            return b-a;
        }
        return impDir?c-d:d-c;
        /*
        if(c===d){

            if(!dateDir){
                return a-b;
            }else{
                return b-a;
            }
        }else{
            return impDir?c-d:d-c;
        }*/
    };
    sortEventsByDate=()=>{

        let dateDir=this.state.dateDir;
        let newevents=this.state.events2;
        let newevents2=this.state.events;
        newevents.sort( this.sortfunc);
        newevents2.sort( this.sortfunc);

        this.setState({events:newevents2});
        this.setState({events2:newevents});
        this.setState({dateDir: 1-dateDir});
        this.setState({impDir:false});
        this.setState({shownPage:1},this.setShownEvents);

    };


    sortEventsByImp=()=>{

        let impDir=this.state.impDir;
        let newevents=this.state.events2;
        let newevents2=this.state.events;
        if(!impDir) {
            newevents.sort(this.sortfunc2);
            newevents2.sort(this.sortfunc2);
        }

        this.setState({events:newevents2});
        this.setState({events2:newevents});
        this.setState({impDir: 1-impDir});
        this.setState({dateDir:true});
        this.setState({shownPage:1},this.setShownEvents)
    };


    updateDates(){

        let newevents=this.state.events.slice();
        //alert(this.state.events.length+"afasfaed")
        let i;
        for(i=0;i<newevents.length;i++) {
            //alert(newevents[i].Date);
            let d=newevents[i].Date;
            newevents[i].normalDate=normalizeDate(d);
        }
        this.setState({events:newevents});

    }



    updatePage= (e,data)=>{


        this.setState({shownPage:data.activePage},this.setShownEvents);



    };

    onDropdownsChange=async()=>{
        let list=[];
        let value1=this.state.drCo;
        let value2=this.state.drEv;
        let value3=this.state.drImp;

            let empty1 = value1.length === 0;
            let empty2 = value2.length === 0;
            let empty3 = value3.length === 0;
            for (let i of this.state.events) {
                if ((value1.includes(i.Country) || empty1) && (value2.includes(i.Event) || empty2)&&(value3.includes(i.Importance)||empty3)) {
                    list.push(i);
                }
            }

        this.setState({events2:list},()=>{this.setState(
            {shownPage:1},this.setShownEvents);
            this.setState({numPages:Math.floor((this.state.events2.length-1)/this.state.eventPerPage)+1})
        })

};


    onCountryChange=async(e,{value})=>{
        this.setState({drCo:value},this.onDropdownsChange);

/*
        let list=[];
        if(value.length>0) {
            for (let i of this.state.events) {
                if (value.includes(i.Country)) {
                    list.push(i);
                }
            }
        }else{
            list=this.state.events;
        }

        //await this.changeEvents2();
        //this.setState({shownPage:1},this.setShownEvents)
        this.setState({events2:list},()=>{this.setState(
            {shownPage:1},this.setShownEvents);
            this.setState({numPages:Math.floor((this.state.events2.length-1)/this.state.eventPerPage)+1})
        })

*/

    };
    onEventChange=async(e,{value})=>{
        this.setState({drEv:value},this.onDropdownsChange);
/*
        let list=[];
        if(value.length>0) {
            for (let i of this.state.events) {
                if (value.includes(i.Event)) {
                    list.push(i);
                }
            }
        }else{
            list=this.state.events;
        }

        //await this.changeEvents2();
        //this.setState({shownPage:1},this.setShownEvents)
        this.setState({events2:list},()=>{this.setState(
            {shownPage:1},this.setShownEvents);
            this.setState({numPages:Math.floor((this.state.events2.length-1)/this.state.eventPerPage)+1})
        })
*/


    };
    onImpChange=(e,{value})=>{
        this.setState({drImp:value},this.onDropdownsChange)
    };


    render() {
        const {shown}  = this.state;
        //const len=shown.length;
        const loading=this.state.loading;

        return (

            !loading?(

                <div style={{display:"flex",justifyContent:"center",alignItems:"center"}} >
                    <Segment  raised piled padded compact textAlign='left'>
                        <Header textAlign='center'>
                            Events
                        </Header>
                        <table className="ui blue table">
                            <thead>
                            <tr>
                                <th>
                                    <div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>

                                        Event

                                        <Dropdown
                                            style={{marginLeft:5}}
                                            placeholder='All'

                                            multiple
                                            search
                                            selection
                                            options={this.state.dropdown2Items}
                                            onChange={this.onEventChange}
                                        />
                                    </div>
                                </th>
                                <th>
                                    <div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>

                                        Country

                                        <Dropdown
                                            style={{marginLeft:5}}
                                            placeholder='All'

                                            multiple
                                            search
                                            selection
                                            options={this.state.dropdownItems}
                                            onChange={this.onCountryChange}
                                        />
                                    </div>

                                </th>
                                <th>

                                    <button style={{backgroundColor:"#fff"}} onClick={this.sortEventsByDate}>
                                        <div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                                            <h4>Date
                                                {this.state.dateDir?
                                                    (<Icon name={"angle down"}/>):(<Icon name={"angle up"}/>)
                                                }
                                            </h4>
                                        </div>
                                    </button>


                                </th>
                                <th><h4>Source</h4></th>
                                <th>
                                    <div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                                        Importance
                                    <Dropdown
                                        style={{marginLeft:5}}
                                        placeholder='All'
                                        multiple
                                        search
                                        selection
                                        options={this.state.dropdown3Items}
                                        onChange={this.onImpChange}
                                    />
                                    </div>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {shown.map(function(event) {

                                const imp=event.Importance;
                                var src;
                                if(imp===3){
                                    src=ThreeStar;
                                }else if(imp===2){
                                    src=TwoStar;
                                }else{
                                    src=OneStar;
                                }

                                return(
                                    <tr>
                                        <td>
                                            <Link to={"/events/"+event.CalendarId}>{event.Event}</Link>
                                        </td>
                                        <td>
                                            {event.Country}

                                        </td>
                                        <td>
                                            {event.normalDate}
                                        </td>
                                        <td>
                                            {event.Source}
                                        </td>
                                        <td>
                                            {<img style={{width:"50px"}} src={src} alt='stars'/>}
                                        </td>
                                    </tr>)
                            })}
                            </tbody>


                        </table>
                        <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                            <Pagination  defaultActivePage={1}
                                         siblingRange={5}
                                         totalPages={this.state.numPages}
                                         activePage={this.state.shownPage}
                                         onPageChange={this.updatePage}
                            />
                        </div>

                    </Segment>
                </div>
            ):(<Loading/>)


        )
    }
}

const dispatchToProps = dispatch => {
    return {
        events: params => dispatch(userActions.events(params)),

    };
};

export function normalizeDate(date){

    const dat = new Date(date);
    const formatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    return dat.toLocaleDateString('en-US', formatOptions);
}
export default connect(null, dispatchToProps)(Events);

