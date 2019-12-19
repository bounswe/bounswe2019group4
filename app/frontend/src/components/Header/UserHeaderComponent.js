import React, {Component} from "react";
import {Menu, Dropdown, Icon, Segment, Label} from "semantic-ui-react";
import * as userActions from "../../actions/userActions";
import connect from "react-redux/es/connect/connect";
import history from "../../_core/history";
import SearchBar from "../Search/Search";
import {normalizeDate} from "../Events/Events";
import {colorDarkerBlue} from "../../utils/constants/Colors";

class UserHeaderComponent extends Component {

    constructor(props){
        super(props);
        this.state={
            notifications:[],
            recommended:[],
            unread:0,
            notifOpen:false
        };
    }


    interval=null;
    componentDidMount() {
        this.getNotifs();
        this.getRecommended();
        this.interval=setInterval(this.getNotifs,10000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    getNotifs=async()=>{
        if(!this.state.notifOpen) {
            let notifs = [];
            await this.props.getNotif().then(result => {
                notifs = result.value.notifications;
                this.setState({notifications: notifs});
                let count = 0;
                for (let i of notifs) {
                    if (i.seen === false) {
                        count++;
                    }
                }
                this.setState({unread: count});
            });
        }
    };
    getRecommended=async()=>{
        this.props.getRecommended().then(result=>{
            this.setState({recommended:result.value.userRecommends})
        })
    };

    navigate(e, {name}) {
        history.push("/" + name);
    }

    logout() {
        this.props.logout().then(result => {
            history.push("/");
        })
    }
    renderNotif=(item)=>{
        let seen=item.seen;
        if(item.text.includes("follow")){
            return(
                <Dropdown.Item  name={"profile"} onClick={this.navigate}>

                    <div style={{display:"flex",flexDirection:"row"}}>
                    <div style={{width:"90%"}}>
                        <Icon color={"green"} name={"user"}/>
                        {item.text}
                    </div>
                        {!item.seen&& <Label style={{marginLeft:30}} circular empty color={"blue"}/>}
                    </div>

                        <div style={{fontSize:12,color:"grey",textAlign:"right",marginTop:7}}>
                            {normalizeDate(item.date)}
                        </div>


                </Dropdown.Item>)
        }else if(item.text.includes("value less")){
            return(
                <Dropdown.Item name={"trading-equipment"} onClick={this.navigate}>
                    <div style={{display:"flex",flexDirection:"row"}}>
                        <div style={{width:"90%"}}>
                            <Icon color={"red"} name={"arrow down"}/>
                            {item.text}
                        </div>
                        {!item.seen&& <Label style={{marginLeft:30}} circular empty color={"blue"}/>}
                    </div>

                    <div style={{fontSize:12,color:"grey",textAlign:"right",marginTop:7}}>
                        {normalizeDate(item.date)}
                    </div>

                </Dropdown.Item>)
        }else if(item.text.includes("value more")){
            return(
                <Dropdown.Item name={"trading-equipment"} onClick={this.navigate}>
                    <div style={{display:"flex",flexDirection:"row"}}>
                        <div style={{width:"90%"}}>
                            <Icon color={"green"} name={"arrow up"}/>
                            {item.text}
                        </div>
                        {!item.seen&& <Label style={{marginLeft:30}} circular empty color={"blue"}/>}
                    </div>

                    <div style={{fontSize:12,color:"grey",textAlign:"right",marginTop:7}}>
                        {normalizeDate(item.date)}
                    </div>

                </Dropdown.Item>)
        }else if(item.text.includes("prediction")&&item.text.includes("nor false")) {
            return (
                <Dropdown.Item name={"trading-equipment"} onClick={this.navigate}>
                    <div style={{display:"flex",flexDirection:"row"}}>
                        <div style={{width:"90%"}}>
                            <Icon name={"arrows alternate horizontal"}/>
                            {item.text}
                        </div>
                        {!item.seen&& <Label style={{marginLeft:30}} circular empty color={"blue"}/>}
                    </div>

                    <div style={{fontSize:12,color:"grey",textAlign:"right",marginTop:7}}>
                        {normalizeDate(item.date)}
                    </div>
                </Dropdown.Item>)
        }else if(item.text.includes("prediction")&&item.text.includes("true")){
            return(
                <Dropdown.Item name={"trading-equipment"} onClick={this.navigate}>
                    <div style={{display:"flex",flexDirection:"row"}}>
                        <div style={{width:"90%"}}>
                            <Icon color={"green"} name={"checkmark"}/>
                            {item.text}
                        </div>
                        {!item.seen&& <Label style={{marginLeft:30}} circular empty color={"blue"}/>}
                    </div>

                    <div style={{fontSize:12,color:"grey",textAlign:"right",marginTop:7}}>
                        {normalizeDate(item.date)}
                    </div>

                </Dropdown.Item>)
        }else if(item.text.includes("prediction")&&item.text.includes("false")){
            return(
                <Dropdown.Item name={"trading-equipment"} onClick={this.navigate}>
                    <div style={{display:"flex",flexDirection:"row"}}>
                        <div style={{width:"90%"}}>
                            <Icon color={"red"} name={"close"}/>
                            {item.text}
                        </div>
                        {!item.seen&& <Label style={{marginLeft:30}} circular empty color={"blue"}/>}
                    </div>

                    <div style={{fontSize:12,color:"grey",textAlign:"right",marginTop:7}}>
                        {normalizeDate(item.date)}
                    </div>

                </Dropdown.Item>)
        }else if(item.text.includes("order executed")){
            return(
                <Dropdown.Item name={"trading-equipment"} onClick={this.navigate}>

                    <div style={{display:"flex",flexDirection:"row"}}>
                        <div style={{width:"90%"}}>
                            <Icon color={"green"} name={"money bill alternate outline"}/>
                            {item.text}
                        </div>
                        {!item.seen&& <Label style={{marginLeft:30}} circular empty color={"blue"}/>}
                    </div>

                    <div style={{fontSize:12,color:"grey",textAlign:"right",marginTop:7}}>
                        {normalizeDate(item.date)}
                    </div>

                </Dropdown.Item>)
        }else{
            return(
                <Dropdown.Item name={"profile"} onClick={this.navigate}>

                    <div style={{display:"flex",flexDirection:"row"}}>
                        <div style={{width:"90%"}}>
                            <Icon name={"info"}/>
                            {item.text}
                        </div>
                        {!item.seen&& <Label style={{marginLeft:30}} circular empty color={"blue"}/>}
                    </div>

                    <div style={{fontSize:12,color:"grey",textAlign:"right",marginTop:7}}>
                        {normalizeDate(item.date)}
                    </div>
                </Dropdown.Item>
            )
        }
    };
    renderRecommended=(item)=>{
        return(
            <Segment style={{margin:10,borderWidth:1,borderRadius:30,borderColor:colorDarkerBlue,backgroundColor:"lightgrey"}}>
                <div style={{display:"flex",flexDirection:"row"}}>
                    <div style={{display:"flex",flex:2,flexDirection:"column"}}>
                        <Label style={{color:"black",fontSize:15}}>
                            <Icon name={"user"}/>
                    <a href={"/profile/"+item._id}>{item.name+" "+item.surname}</a>
                        </Label>
                        <Label style={{marginTop:5}}>
                            <Icon name={"map pin"}/>

                            {item.location}

                        </Label>
                    </div>
                    <div style={{color:"black",flexDirection:"column",fontSize:12,marginLeft:10}}>

                        <Label color={"green"}>
                        {"Pr.Rate: "+item.predictionRate}
                        </Label>
                    </div>

                </div>
                <div>

                </div>

            </Segment>
        )
    }
    handleOnClose=async()=>{
            this.setState({notifOpen:false})
            this.props.readNotif().then(()=>{
                this.setState({unread:0})
            });


    }

    render() {
        return (
            <Menu.Menu position="right">
                <Menu.Item position="right">
                    <SearchBar/>
                </Menu.Item>
                <Menu.Item
                    style={{display: "flex", alignItems: "center"}}
                    name="profile"
                    onClick={this.navigate}
                >

                    <i className="fas fa-user-circle fa-2x" style={{ margin: 10}} />
                </Menu.Item>
                <Menu.Item
                    style={{display: "flex", alignItems: "center"}}
                    name="notifications"

                >
                    <Dropdown  trigger={<div> <i className="fas fa-bell" style={{ margin: 10}} />{this.state.unread!==0?<Label color={"yellow"}>{this.state.unread}</Label>:null}</div> }
                               onClose={this.handleOnClose}
                               onOpen={()=>this.setState({notifOpen:true})}
                               icon={null}>

                        <Dropdown.Menu style={{overflowY:"auto",maxHeight:400,background:"lightgrey"}}>
                            {this.state.notifications.map(item=>
                                this.renderNotif(item)
                            )}

                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
                <Menu.Item
                    style={{display: "flex", alignItems: "center"}}
                    name="users"
                    // onClick={this.navigate}
                >
                    <Dropdown  trigger={<i className="fas fa-user-plus" style={{ margin: 10}} />} icon={null}>

                        <Dropdown.Menu style={{overflowY:"auto",maxHeight:400,width:"20vw",background:"lightgrey"}}>
                            <Dropdown.Header >Recommended Users</Dropdown.Header>
                            {this.state.recommended.map(item=>this.renderRecommended(item))



                            }
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
                <Menu.Item
                    style={{display: "flex", alignItems: "center"}}
                    name="settings"

                >
                        <a style={{color:"white"}} href={"https://github.com/bounswe/bounswe2019group4"}>
                    <Icon name={"github"}/>
                    </a>

                </Menu.Item>
                <Menu.Item
                    style={{display: "flex", alignItems: "center"}}
                    name="settings"
                   // onClick={this.navigate}
                >
                    <Dropdown  trigger={<i className="fas fa-cog" style={{ margin: 10}} />} icon={null}>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={this.logout.bind(this)}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>

            </Menu.Menu>
        )
    }
}

const dispatchToProps = dispatch => {
    return {
        logout: () => dispatch(userActions.logout()),
        getNotif:()=>dispatch(userActions.getNotif()),
        readNotif:()=>dispatch(userActions.readNotif()),
        getRecommended:()=>dispatch(userActions.getRecommended())

    };
};

export default connect(
    null,
    dispatchToProps
)(UserHeaderComponent);
