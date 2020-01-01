import react, {component} from 'react';
import {loadstate} from '../../_core/localstorage'
import {header, icon, pagination, segment,dropdown,popup,button} from 'semantic-ui-react';
import {connect} from 'react-redux';
import onestar from '../../assets/onestar.png'
import twostar from '../../assets/twostar.png'
import threestar from '../../assets/threestar.png'
import {link} from 'react-router-dom'
import * as useractions from '../../actions/useractions';
import loading from "../loading";
import datepicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";

class allportfolios extends component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            events: [],
            events2:[],
            shown:[],
            shownpage:1,
            totalnumofevents:0,
            eventperpage:8,
            datedir:false,
            impdir:false,
            dropdownitems:[],
            dropdown2items:[],
            dropdown3items:[
                {key:1,value:1,text:"1",image:onestar},
                {key:2,value:2,text:"2",image:twostar},
                {key:3,value:3,text:"3",image:threestar}
            ],
            drco:[],
            drev:[],
            drimp:[],
            drsrc:[],
            loading:false,
            startdate:new date(),
            enddate:new date()

        }


    }

    async componentdidmount() {

        const localstate = loadstate();
        this.setstate({user: localstate.user});
        await this.getevents();
        this.setshownevents();
        this.sorteventsbydate();
        await this.setinitialdates();

    }
    setinitialdates=async ()=>{
        let {0 : a ,length : l, [l - 1] : b} = this.state.events2;

        await this.setstate({startdate:new date(b.date.tostring()),enddate:new date(a.date.tostring())});
    };

    getcountriesfordropdown=()=>{
        let dropdownitems=[];
        let key=1;
        for(let i of this.state.events ){
            let check=false;
            for(let j of dropdownitems){
                if(j.value.trim()===i.country.trim()){
                    check=true;
                    break;
                }
            }
            if(!check){
                let newitem={
                    key:key,
                    text:i.country,
                    value:i.country

                };
                dropdownitems.push(newitem);
                key++;
            }
        }
        dropdownitems.sort((a,b)=>{
            return ('' + a.value).localecompare(b.value);
        });
        this.setstate({dropdownitems:dropdownitems});
    };
    geteventsfordropdown=()=>{
        let dropdownitems=[];
        let key=1;
        for(let i of this.state.events ){
            let check=false;
            for(let j of dropdownitems){
                if(j.value.trim()===i.event.trim()){
                    check=true;
                    break;
                }
            }
            if(!check){
                let newitem={
                    key:key,
                    text:i.event,
                    value:i.event

                };
                dropdownitems.push(newitem);
                key++;
            }
        }
        dropdownitems.sort((a,b)=>{
            return ('' + a.value).localecompare(b.value);
        });
        this.setstate({dropdown2items:dropdownitems});
    };
    getsourcesfordropdown=()=>{
        let dropdownitems=[];
        let key=1;
        for(let i of this.state.events ){
            let check=false;
            for(let j of dropdownitems){
                if(j.value.trim()===i.source.trim()){
                    check=true;
                    break;
                }
            }
            if(!check){
                let newitem={
                    key:key,
                    text:i.source,
                    value:i.source

                };
                dropdownitems.push(newitem);
                key++;
            }
        }
        dropdownitems.sort((a,b)=>{
            return ('' + a.value).localecompare(b.value);
        });
        this.setstate({dropdown4items:dropdownitems});

    };

    setshownevents(){

        let arr=this.state.events2.slice((this.state.shownpage-1)*this.state.eventperpage,(this.state.shownpage)*this.state.eventperpage);

        this.setstate({shown:arr});

    }

    async getevents(){  //alert(object.keys(result.action.payload));
        this.setstate({loading:true});
        await this.props.events("?page=1&limit=1").then(result=>{

            let a=result.value.totalnumberofevents;
            this.setstate({totalnumofevents:a});
            this.setstate({numpages:math.floor((a-1)/this.state.eventperpage)+1});
        }).then(async()=> {


            await this.props.events("?page=1&limit=" + this.state.totalnumofevents).then(result => {

                this.setstate({events: result.value.events}, this.updatedates);


            }).then(()=>{
                this.setstate({events2:this.state.events});
                this.getcountriesfordropdown();
                this.geteventsfordropdown();
                this.getsourcesfordropdown();
                this.setstate({loading:false});
            })
        });
    }

    sortfunc=(f,g)=>{
        let datedir=this.state.datedir;
        let a=new date(f.normaldate);
        let b=new date(g.normaldate);
        let c=f.importance;
        let d=g.importance;
        if(a.gettime()===b.gettime()) {
            return d-c;
        }
        return datedir?a-b:b-a;

    };

    sorteventsbydate=()=>{

        let datedir=this.state.datedir;
        let newevents=this.state.events2;
        let newevents2=this.state.events;
        newevents.sort( this.sortfunc);
        newevents2.sort( this.sortfunc);

        this.setstate({events:newevents2});
        this.setstate({events2:newevents});
        this.setstate({datedir: 1-datedir});
        this.setstate({impdir:false});
        this.setstate({shownpage:1},this.setshownevents);

    };

    updatedates(){

        let newevents=this.state.events.slice();
        let i;
        for(i=0;i<newevents.length;i++) {
            let d=newevents[i].date;
            newevents[i].normaldate=normalizedate(d);
        }
        this.setstate({events:newevents});

    }

    updatepage= (e,data)=>{
        this.setstate({shownpage:data.activepage},this.setshownevents);
    };

    ondropdownschange=async()=>{
        let list=[];
        let value1=this.state.drco;
        let value2=this.state.drev;
        let value3=this.state.drimp;
        let value4=this.state.drsrc;

        let empty1 = value1.length === 0;
        let empty2 = value2.length === 0;
        let empty3 = value3.length === 0;
        let empty4 = value4.length===0;
        for (let i of this.state.events) {
            let date=new date(i.normaldate);

            if ((value1.includes(i.country) || empty1) && (value2.includes(i.event) || empty2)&&(value3.includes(i.importance)||empty3)&&
                (comparedates(this.state.startdate,date)&&comparedates(date,this.state.enddate))&&
                (value4.includes(i.source)||empty4)

            ) {
                list.push(i);
            }
        }

        this.setstate({events2:list},()=>{this.setstate(
            {shownpage:1},this.setshownevents);
            this.setstate({numpages:math.floor((this.state.events2.length-1)/this.state.eventperpage)+1})
        })

    };


    oncountrychange=async(e,{value})=>{
        this.setstate({drco:value},this.ondropdownschange);

    };
    oneventchange=async(e,{value})=>{
        this.setstate({drev:value},this.ondropdownschange);


    };
    onimpchange=(e,{value})=>{
        this.setstate({drimp:value},this.ondropdownschange)
    };
    onsourcechange=(e,{value})=>{
        this.setstate({drsrc:value},this.ondropdownschange)
    };

    startdatechange=(date)=>{
        this.setstate({startdate:date},this.ondropdownschange);

    };

    enddatechange=(date)=>{
        this.setstate({enddate:date},this.ondropdownschange);
    };

    render() {
        const {shown}  = this.state;
        const loading=this.state.loading;

        return (

            !loading?(

                <div style={{display:"flex",justifycontent:"center",alignitems:"center"}} >
                    <segment  raised piled padded compact textalign='left'>
                        <header textalign='center'>
                            events

                        </header>
                        <table classname="ui blue table">
                            <thead>
                            <tr>
                                <th>
                                    <div style={{display:"flex",flexdirection:"row",alignitems:"center"}}>

                                        event

                                        <dropdown
                                            style={{marginleft:5}}
                                            placeholder='all'

                                            multiple
                                            search
                                            selection
                                            options={this.state.dropdown2items}
                                            onchange={this.oneventchange}
                                        />
                                    </div>
                                </th>
                                <th>
                                    <div style={{display:"flex",flexdirection:"row",alignitems:"center"}}>

                                        country

                                        <dropdown
                                            style={{marginleft:5}}
                                            placeholder='all'

                                            multiple
                                            search
                                            selection
                                            options={this.state.dropdownitems}
                                            onchange={this.oncountrychange}
                                        />

                                    </div>

                                </th>
                                <th>
                                    <div style={{display:"flex",flexdirection:"row",alignitems:"center"}}>

                                        date
                                        <button.group style={{marginleft:6,marginright:20}}>
                                            <button onclick={this.sorteventsbydate}>
                                                <div style={{display:"flex",flexdirection:"row",justifycontent:"center",alignitems:"center"}}>

                                                    {this.state.datedir?
                                                        (<icon name={"angle down"}/>):(<icon name={"angle up"}/>)
                                                    }

                                                </div>
                                            </button>


                                            <popup trigger={
                                                <button>
                                                    <icon name={"filter"}/>
                                                </button>
                                            } flowing hoverable>
                                                <div style={{display:"flex",flexdirection:"column",alignitems:"center",marginleft:5}}>

                                                    <datepicker
                                                        selected={this.state.startdate}
                                                        onchange={this.startdatechange}
                                                    />
                                                    to
                                                    <datepicker
                                                        selected={this.state.enddate}
                                                        onchange={this.enddatechange}
                                                    />
                                                </div>
                                            </popup>
                                        </button.group>
                                    </div>

                                </th>

                                <th>
                                    <div style={{display:"flex",flexdirection:"row",justifycontent:"center",alignitems:"center"}}>
                                        source

                                        <dropdown
                                            style={{marginleft:5}}
                                            placeholder='all'
                                            multiple
                                            search
                                            selection
                                            options={this.state.dropdown4items}
                                            onchange={this.onsourcechange}
                                        />


                                    </div>

                                </th>
                                <th>
                                    <div style={{display:"flex",flexdirection:"row",justifycontent:"center",alignitems:"center"}}>
                                        importance

                                        <dropdown
                                            style={{marginleft:5}}
                                            placeholder='all'
                                            multiple
                                            search
                                            selection
                                            options={this.state.dropdown3items}
                                            onchange={this.onimpchange}
                                        />


                                    </div>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {shown.map(function(event) {

                                const imp=event.importance;
                                var src;
                                if(imp===3){
                                    src=threestar;
                                }else if(imp===2){
                                    src=twostar;
                                }else{
                                    src=onestar;
                                }

                                return(
                                    <tr>
                                        <td>
                                            <link to={"/events/"+event.calendarid}>{event.event}</link>
                                        </td>
                                        <td>
                                            {event.country}

                                        </td>
                                        <td>
                                            {event.normaldate}
                                        </td>
                                        <td>
                                            {event.source}
                                        </td>
                                        <td>
                                            {<img style={{width:"50px"}} src={src} alt='stars'/>}
                                        </td>
                                    </tr>)
                            })}
                            </tbody>


                        </table>
                        <div style={{display:"flex",flexdirection:"column",alignitems:"center"}}>
                            <pagination  defaultactivepage={1}
                                         siblingrange={5}
                                         totalpages={this.state.numpages}
                                         activepage={this.state.shownpage}
                                         onpagechange={this.updatepage}
                            />
                        </div>

                    </segment>

                </div>
            ):(<loading/>)


        )
    }
}

const dispatchtoprops = dispatch => {
    return {
        events: params => dispatch(useractions.events(params)),

    };
};

export function normalizedate(date){

    const dat = new date(date);
    const formatoptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    return dat.tolocaledatestring('en-us', formatoptions);
}
export function comparedates(a,b) { //date a <= date b
    let c=a.getfullyear();
    let d=b.getfullyear();

    let m1=a.getmonth();
    let m2=b.getmonth();
    let d1=a.getdate();
    let d2=b.getdate();


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
export default connect(null, dispatchtoprops)(events);

