import React, {Component} from 'react';
import {loadState} from '../../_core/localStorage'
import {Button, Dropdown, Header, Icon, Pagination, Popup, Segment,Label,Grid,Tab} from 'semantic-ui-react';

import {connect} from 'react-redux';
import {Link} from 'react-router-dom'
import * as userActions from '../../actions/userActions';
import Loading from "../Loading";
import DatePicker, {getDefaultLocale, registerLocale, setDefaultLocale} from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import {normalizeDate, compareDates, normalizeDateToTR} from "../Events/Events";
import {colorBG, colorDarkerBlue} from "../../utils/constants/Colors";


class AllArticles extends Component {

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
            drTitle:[],
            drAuthor:[],
            loading:false,
            startDate:new Date(),
            endDate:new Date(),

            recommended:false,
            recommendedArticles:[]



        }


    }

    async componentDidMount() {

        const localState = loadState();
        this.setState({user: localState.user});
        await this.getArticles();

        this.setShownEvents();
        this.sortEventsByDate();
        await this.setInitialDates();

        if(loadState().user!==null&&loadState().user.loggedIn){
            this.getRecommendedArticles();
        }
    }
    setInitialDates=async ()=>{
        let {0 : a ,length : l, [l - 1] : b} = this.state.events2;

        await this.setState({startDate:new Date(b.date.toString()),endDate:new Date(a.date.toString())});
    };

    getRecommendedArticles=()=>{

        this.props.getRecommendedArticles().then(result=>{
            this.setState({recommendedArticles:result.value.articleRecommends})
        })
    };

    getTitlesForDropdown=()=>{

        let dropdownItems=[];
        let key=1;
        for(let i of this.state.events ){
            let check=false;
            for(let j of dropdownItems){
                if(j.value.trim()===i.title.trim()){

                    check=true;
                    break;
                }
            }
            if(!check){
                let newitem={
                    key:key,

                    text:i.title,
                    value:i.title
                };
                dropdownItems.push(newitem);
                key++;
            }
        }
        dropdownItems.sort((a,b)=>{
            return ('' + a.value).localeCompare(b.value);
        });

        this.setState({titleItems:dropdownItems});
    };
    getAuthorsForDropdown=()=>{

        let dropdownItems=[];
        let key=1;
        for(let i of this.state.events ){
            let check=false;

            let author=i.username+" "+i.usersurname;
            for(let j of dropdownItems){
                if(j.value.trim()===author.trim()){

                    check=true;
                    break;
                }
            }
            if(!check){
                let newitem={
                    key:key,

                    text:author,
                    value:author


                };
                dropdownItems.push(newitem);
                key++;
            }
        }
        dropdownItems.sort((a,b)=>{
            return ('' + a.value).localeCompare(b.value);
        });

        this.setState({authorItems:dropdownItems});

    };

    setShownEvents(){

        let arr=this.state.events2.slice((this.state.shownPage-1)*this.state.eventPerPage,(this.state.shownPage)*this.state.eventPerPage);

        this.setState({shown:arr});

    }

    async getArticles(){

        this.setState({loading:true});
        await this.props.articles("?page=1&limit=1").then(result=>{
            let a=result.value.totalNumberOfArticles;
            this.setState({totalNumOfEvents:a,numPages:Math.floor((a-1)/this.state.eventPerPage)+1});
           return a;
        }).then(async(a)=> {

            await this.props.articles("?page=1&limit=" + a).then(result => {

                this.setState({events: result.value.articles});
            }).then(async()=>{
                this.updateDates();
               // await this.getAuthors()
            }).then(()=>{

                this.setState({events2:this.state.events});
                this.getTitlesForDropdown();
                this.getAuthorsForDropdown();
                this.setState({loading:false});
            })
        });
    }


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


        let i;
        for(i=0;i<newevents.length;i++) {
            let d=newevents[i].date;

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

        let value1=this.state.drTitle;
        let value2=this.state.drAuthor;
        let empty1 = value1.length === 0;
        let empty2 = value2.length === 0;
        for (let i of this.state.events) {
            let date=new Date(i.normalDate);
            if ((value1.includes(i.title) || empty1) && (value2.includes(i.username+" "+i.usersurname) || empty2)//&&(value3.includes(i.Importance)||empty3)
                &&(compareDates(this.state.startDate,date)&&compareDates(date,this.state.endDate))

            ) {
                list.push(i);
            }
        }

        this.setState({events2:list},()=>{this.setState(
            {shownPage:1},this.setShownEvents);
            this.setState({numPages:Math.floor((this.state.events2.length-1)/this.state.eventPerPage)+1})
        })

    };




    onTitleChange=async(e,{value})=>{
        this.setState({drTitle:value},this.onDropdownsChange);

    };
    onAuthorChange=async(e,{value})=>{
        this.setState({drAuthor:value},this.onDropdownsChange);


    };

    startDateChange=(date)=>{
        this.setState({startDate:date},this.onDropdownsChange);

    };

    endDateChange=(date)=>{
        this.setState({endDate:date},this.onDropdownsChange);
    };

    renderArticles=()=>{
        const {shown}  = this.state;
        //const len=shown.length;

        return(
            <div style={{display:"flex",justifyContent:"center",alignItems:"center"}} >
                <div style={{fontWeight: "bold", fontSize: 16,marginLeft:20,marginRight:20}} >

                    <table className="ui table inverted " style={{background: "rgba(255,255,255,0)"}}>

                        <thead>
                        <tr >
                            <th className={"four wide"}>
                                <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}>


                                    Article


                                    <Dropdown
                                        style={{marginLeft:5}}
                                        placeholder='All'

                                        multiple
                                        search
                                        selection

                                        options={this.state.titleItems}
                                        onChange={this.onTitleChange}

                                    />
                                </div>
                            </th>
                            <th className={"four wide"}>
                                <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}>


                                    Author


                                    <Dropdown
                                        style={{marginLeft:5}}
                                        placeholder='All'

                                        multiple
                                        search
                                        selection

                                        options={this.state.authorItems}
                                        onChange={this.onAuthorChange}

                                    />

                                </div>

                            </th>
                            <th className={"two wide"}>
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
                                                    locale={"pt-BR"}
                                                    dateFormat={"P"}
                                                    selected={this.state.startDate}
                                                    onChange={this.startDateChange}
                                                />
                                                to
                                                <DatePicker

                                                    selected={this.state.endDate}
                                                    onChange={this.endDateChange}
                                                />
                                            </div>
                                        </Popup>
                                    </Button.Group>
                                </div>

                            </th>

                            <th className={"two wide"}>


                                Rating


                            </th>

                        </tr>
                        </thead>
                        <tbody>
                        {shown.map(function(article) {


                            return(
                                <tr>
                                    <td>

                                        <Link to={"/articles/"+article._id}>{article.title}</Link>
                                    </td>
                                    <td>
                                        <Link to={"/profile/"+article.userId}>{article.username+" "+article.usersurname}</Link>

                                    </td>
                                    <td>
                                        {article.normalDateTr}
                                    </td>
                                    <td>
                                        <div style={{display:"flex",flexDirection:"row"}}>

                                            <Label style={{fontSize:14}} color={"yellow"} >
                                                <div style={{display:"flex",flexDirection:"row",width:25,justifyContent:"center"}}>
                                                    {article.rateAverage}
                                                </div>
                                            </Label>

                                            <Label>
                                                <div style={{display:"flex",flexDirection:"row",width:25}}>
                                                    <Icon name='users' />
                                                    {article.numberOfRates}
                                                </div>
                                            </Label>
                                        </div>
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
        );
    };
    renderRecom=()=>{
        return(
        <div style={{display:"flex",justifyContent:"center",alignItems:"center"}} >
            <div style={{fontWeight: "bold", fontSize: 16,marginLeft:20,marginRight:20}} >
                <table className="ui table inverted fixed" style={{background: "rgba(255,255,255,0)"}}>
                    <thead>
                    <tr >
                        <th className={"four wide"}>
                            Article
                        </th>
                        <th className={"two wide"}>
                            Author
                        </th>
                        <th className={"two wide"}>
                            Date
                        </th>
                        <th className={"two wide"}>
                            Rating
                        </th>

                    </tr>
                    </thead>
                    <tbody>
                    {this.state.recommendedArticles.map(function(article) {


                        return(
                            <tr>
                                <td>

                                    <Link to={"/articles/"+article._id}>{article.title}</Link>
                                </td>
                                <td>
                                    <Link to={"/profile/"+article.userId}>{article.username+" "+article.usersurname}</Link>

                                </td>
                                <td>
                                    {normalizeDateToTR(article.date)}
                                </td>
                                <td>
                                    <div style={{display:"flex",flexDirection:"row"}}>

                                        <Label style={{fontSize:14}} color={"yellow"} >
                                            <div style={{display:"flex",flexDirection:"row",width:25,justifyContent:"center"}}>
                                                {article.rateAverage}
                                            </div>
                                        </Label>
                                        <Label>
                                            <div style={{display:"flex",flexDirection:"row",width:25}}>
                                                <Icon name='users' />
                                                {article.numberOfRates}
                                            </div>
                                        </Label>

                                    </div>
                                </td>


                            </tr>)
                    })}
                    </tbody>

                </table>
            </div>
        </div>
        )

    }
    handleClick=()=>{

        this.setState({recommended:!this.state.recommended})
    }

    render() {


        return (

            !this.state.loading?(

                <Grid>
                    <Grid.Row>

                        <Grid.Column width={4}>
                            {loadState().user!==null&&loadState().user.loggedIn&&
                            <div style={{display:"flex",alignItems:"flex-start",marginLeft:20}}>
                                <Button onClick={this.handleClick} inverted style={{borderRadius:20,borderWidth:1.5}} content={this.state.recommended?"Show All":"Show Recommended Articles"}/>
                            </div>
                                }
                        </Grid.Column>
                        <Grid.Column width={8}>

                            {!this.state.recommended||loadState().user===null||!loadState().user.loggedIn?this.renderArticles():this.renderRecom()}


                        </Grid.Column>
                        <Grid.Column width={4}/>
                    </Grid.Row>

                </Grid>
            ):(<Loading/>)


        )
    }
}

const dispatchToProps = dispatch => {
    return {

        articles: params => dispatch(userActions.getAllArticles(params)),
        authors:params=>dispatch(userActions.profile(params)),
        getRecommendedArticles:params=>dispatch(userActions.getRecommended(params))
    };
};

export default connect(null, dispatchToProps)(AllArticles);


