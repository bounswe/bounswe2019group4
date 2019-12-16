import React, {Component} from 'react';
import {loadState} from '../../_core/localStorage'
import {Header, Icon, Pagination, Segment,Dropdown,Popup,Button,Rating} from 'semantic-ui-react';
import {connect} from 'react-redux';
import OneStar from '../../assets/onestar.png'
import TwoStar from '../../assets/twostar.png'
import ThreeStar from '../../assets/threestar.png'
import {Link} from 'react-router-dom'
import * as userActions from '../../actions/userActions';
import Loading from "../Loading";
import DatePicker, {registerLocale} from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";


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
            eventPerPage:10,
            dateDir:false,
            impDir:false,
            dropdownItems:[],
            dropdown2Items:[],
            dropdown3Items:[
                {key:1,value:1,text:"1",image:OneStar},
                {key:2,value:2,text:"2",image:TwoStar},
                {key:3,value:3,text:"3",image:ThreeStar}
            ],
            drCo:[],
            drEv:[],
            drImp:[],
            drSrc:[],
            loading:false,
            startDate:new Date(),
            endDate:new Date()
        }
    }

    async componentDidMount() {

        const localState = loadState();
        this.setState({user: localState.user});
        await this.getEvents();
        this.setShownEvents();
        this.sortEventsByDate();
        await this.setInitialDates();

    }
    setInitialDates=async ()=>{
        let {0 : a ,length : l, [l - 1] : b} = this.state.events2;

        await this.setState({startDate:new Date(b.Date.toString()),endDate:new Date(a.Date.toString())});
    };

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
    getSourcesForDropdown=()=>{
        let dropdownItems=[];
        let key=1;
        for(let i of this.state.events ){
            let check=false;
            for(let j of dropdownItems){
                if(j.value.trim()===i.Source.trim()){
                    check=true;
                    break;
                }
            }
            if(!check){
                let newitem={
                    key:key,
                    text:i.Source,
                    value:i.Source

                };
                dropdownItems.push(newitem);
                key++;
            }
        }
        dropdownItems.sort((a,b)=>{
            return ('' + a.value).localeCompare(b.value);
        });
        this.setState({dropdown4Items:dropdownItems});

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
                this.getSourcesForDropdown();
                this.setState({loading:false});
            })
        });
    }



    /*
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
    */
    sortfunc=(f,g)=>{
        let dateDir=this.state.dateDir;
        let a=new Date(f.normalDate);
        let b=new Date(g.normalDate);
        let c=f.Importance;
        let d=g.Importance;
        if(a.getTime()===b.getTime()) {
            return d-c;
        }
        return dateDir?a-b:b-a;

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

    updateDates(){

        let newevents=this.state.events.slice();
        //alert(this.state.events.length+"afasfaed")
        let i;
        for(i=0;i<newevents.length;i++) {
            let d=newevents[i].Date;
            newevents[i].normalDate=normalizeDate(d);
            newevents[i].normalDateTr=normalizeDateToTR(d);
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
        let value4=this.state.drSrc;

            let empty1 = value1.length === 0;
            let empty2 = value2.length === 0;
            let empty3 = value3.length === 0;
            let empty4 = value4.length===0;
            for (let i of this.state.events) {
                let date=new Date(i.normalDate);

                if ((value1.includes(i.Country) || empty1) && (value2.includes(i.Event) || empty2)&&(value3.includes(i.Importance)||empty3)&&
                    (compareDates(this.state.startDate,date)&&compareDates(date,this.state.endDate))&&
                    (value4.includes(i.Source)||empty4)

                ) {
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



    };
    onEventChange=async(e,{value})=>{
        this.setState({drEv:value},this.onDropdownsChange);


    };
    onImpChange=(e,{value})=>{
        this.setState({drImp:value},this.onDropdownsChange)
    };
    onSourceChange=(e,{value})=>{
        this.setState({drSrc:value},this.onDropdownsChange)
    };

    startDateChange=(date)=>{
        this.setState({startDate:date},this.onDropdownsChange);

    };

    endDateChange=(date)=>{
        this.setState({endDate:date},this.onDropdownsChange);
    };

    render() {
        const {shown}  = this.state;
        //const len=shown.length;
        const loading=this.state.loading;

        return (

            !loading?(
                <div style={{display:"flex", flexDirection: "column",justifyContent:"center",alignItems:"center"}}>
                <div style={{fontWeight: "bold", fontSize: 16}} >


                        <table className="ui table inverted" style={{background: "rgba(255,255,255,0)"}}>

                            <thead>
                            <tr>
                                <th>
                                    <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}>

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
                                <th >
                                    <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}>

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
                                <th  class={"two wide"}>
                                    <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}>

                                        Date
                                        <Button.Group style={{marginLeft:6,marginRight:20}}>
                                        <Button onClick={this.sortEventsByDate}>
                                            <div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>

                                                    {this.state.dateDir?
                                                        (<Icon name={"angle down"}/>):(<Icon name={"angle up"}/>)
                                                    }

                                            </div>
                                        </Button>


                                        <Popup trigger={
                                            <Button>
                                            <Icon name={"filter"}/>
                                            </Button>
                                        } flowing hoverable>
                                            <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginLeft:5}}>

                                                <DatePicker
                                                    locale={"tr"}
                                                    selected={this.state.startDate}
                                                    onChange={this.startDateChange}
                                                />
                                                to
                                                <DatePicker
                                                    locale={"tr"}
                                                    selected={this.state.endDate}
                                                    onChange={this.endDateChange}
                                                />
                                            </div>
                                        </Popup>
                                        </Button.Group>
                                    </div>

                                </th>

                                <th>
                                    <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
                                        Source

                                        <Dropdown
                                            style={{marginLeft:5}}
                                            placeholder='All'
                                            multiple
                                            search
                                            selection
                                            options={this.state.dropdown4Items}
                                            onChange={this.onSourceChange}
                                        />


                                    </div>

                                </th>
                                <th class={"four wide"}>
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
                                    src=(<Rating defaultRating={0} maxRating={3} disabled />);
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
                                            {event.normalDateTr}
                                        </td>
                                        <td>
                                            {event.Source}
                                        </td>
                                        <td>
                                            {<Rating defaultRating={imp} maxRating={3} disabled icon='star' style={{color:"white"}} />}
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
                                         style={{background: "rgba(0,0,0,0)", color: "#ffffff !important", fontWeight: "bold"}}
                            />
                        </div>


                </div>
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
        hour12: false
    };
    return dat.toLocaleDateString('en-us', formatOptions);
}
export function normalizeDateToTR(date){

    const dat = new Date(date);
    const formatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    return dat.toLocaleDateString('tr', formatOptions);
}
export function compareDates(a,b) { //date a <= date b
    let c=a.getFullYear();
    let d=b.getFullYear();

    let m1=a.getMonth();
    let m2=b.getMonth();
    let d1=a.getDate();
    let d2=b.getDate();


    if(c>d) {

        return false;
    }
    else if(c===d){

        if(m1>m2)
            return false;
        else if(m1===m2){
            if(d1>d2)
                return false;
        }
    }
    return true;


}
export default connect(null, dispatchToProps)(Events);

