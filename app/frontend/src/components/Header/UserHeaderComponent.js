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
            recommended:[]
        };
    }


    interval=null;
    componentDidMount() {
        this.getNotifs();
        this.getRecommended();
        //this.interval=setInterval(this.getNotifs,5000);
    }
    componentWillUnmount() {
        //clearInterval(this.interval);
    }

    getNotifs=async()=>{

        await this.props.getNotif().then(result=>{
            let notifs=result.value.notifications;
            this.setState({notifications:notifs});

        });
    };
    getRecommended=async()=>{
        this.props.getRecommended().then(result=>{
            this.setState({recommended:result.value.userRecommends})
        })
    }

    navigate(e, {name}) {
        history.push("/" + name);
    }

    logout() {
        this.props.logout().then(result => {
            history.push("/");
        })
    }
    renderNotif=(item)=>{
        if(item.text.includes("follow")){
            return(
                <Dropdown.Item name={"profile"} onClick={this.navigate}>
                    <Icon color={"green"} name={"user"}/>
                    {item.text}
                    <div style={{fontSize:12,color:"grey",textAlign:"right",marginTop:7}}>
                        {normalizeDate(item.date)}
                    </div>
                </Dropdown.Item>)
        }else if(item.text.includes("value less")){
            return(
                <Dropdown.Item name={"trading-equipment"} onClick={this.navigate}>
                    <Icon color={"red"} name={"arrow down"}/>
                    {item.text}
                    <div style={{fontSize:12,color:"grey",textAlign:"right",marginTop:7}}>
                        {normalizeDate(item.date)}
                    </div>
                </Dropdown.Item>)
        }else if(item.text.includes("value more")){
            return(
                <Dropdown.Item name={"trading-equipment"} onClick={this.navigate}>
                    <Icon color={"green"} name={"arrow up"}/>
                    {item.text}
                    <div style={{fontSize:12,color:"grey",textAlign:"right",marginTop:7}}>
                        {normalizeDate(item.date)}
                    </div>
                </Dropdown.Item>)
        }else if(item.text.includes("prediction")&&item.text.includes("nor false")) {
            return (
                <Dropdown.Item name={"trading-equipment"} onClick={this.navigate}>
                    <Icon  name={"arrows alternate horizontal"}/>
                    {item.text}
                    <div style={{fontSize:12,color:"grey",textAlign:"right",marginTop:7}}>
                        {normalizeDate(item.date)}
                    </div>
                </Dropdown.Item>)
        }else if(item.text.includes("prediction")&&item.text.includes("true")){
            return(
                <Dropdown.Item name={"trading-equipment"} onClick={this.navigate}>
                    <Icon color={"green"} name={"checkmark"}/>
                    {item.text}
                    <div style={{fontSize:12,color:"grey",textAlign:"right",marginTop:7}}>
                        {normalizeDate(item.date)}
                    </div>
                </Dropdown.Item>)
        }else if(item.text.includes("prediction")&&item.text.includes("false")){
            return(
                <Dropdown.Item name={"trading-equipment"} onClick={this.navigate}>
                    <Icon color={"red"} name={"close"}/>
                    {item.text}
                    <div style={{fontSize:12,color:"grey",textAlign:"right",marginTop:7}}>
                        {normalizeDate(item.date)}
                    </div>
                </Dropdown.Item>)
        }else if(item.text.includes("order executed")){
            return(
                <Dropdown.Item name={"trading-equipment"} onClick={this.navigate}>
                    <Icon color={"green"} name={"money bill alternate outline"}/>
                    {item.text}
                    <div style={{fontSize:12,color:"grey",textAlign:"right",marginTop:7}}>
                        {normalizeDate(item.date)}
                    </div>
                </Dropdown.Item>)
        }else{
            return(
                <Dropdown.Item name={"profile"} onClick={this.navigate}>
                    <Icon name={"info"}/>
                    {item.text}
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
                    <Dropdown  trigger={ <i className="fas fa-bell" style={{ margin: 10}} /> }
                               onClick={this.getNotifs}
                               icon={null}>

                        <Dropdown.Menu style={{overflowY:"auto",maxHeight:200}}>
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
        getRecommended:()=>dispatch(userActions.getRecommended())

    };
};

export default connect(
    null,
    dispatchToProps
)(UserHeaderComponent);
