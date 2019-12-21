import React, {Component} from "react";
import {Comment, Divider, Button, Modal, Image, Header, Icon, Popup, Segment, Form} from "semantic-ui-react";
import {Link} from "react-router-dom";
import {normalizeDate,normalizeDateToTR} from "./Events/Events";
import {loadState} from "../_core/localStorage";
import * as userActions from "../actions/userActions";
import {connect} from "react-redux";
import {colorAccent, colorBG, colorDarkerBlue, colorPrimary} from "../utils/constants/Colors";


class Comments extends Component{


    state={
        user:{},
        loading:false,
        rest:1000,
        text:""
    };

     async componentDidMount() {

         this.scrollBottom();
        const localState = loadState();
        await this.setState({user: localState.user});

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.data!==prevProps.data){
            this.scrollBottom();
        }
    }

    scrollBottom(){

        this.cgroup=document.getElementById("cgroup");
        this.cgroup.scrollTop=this.cgroup.scrollHeight;
    };

    preview=(comment)=>{
        return comment.substr(0,200)+"...";
    };

    deleteComment=async(id)=>{
        let type=this.props.type;
        let check=window.confirm("Delete comment?");
        if(check) {
            await this.props.deleteComment("/" + type + "/" + id).then(() => {
                this.props.resendComments();
            })
        }
    };

    onSubmit=async ()=>{

        if(this.state.text!=="") {
            let calendarID=this.props._id;  //_id = ("USD") or calendarid of event
            let com;
            if(this.props.type==="event") {
                 com = {
                    text: this.state.text,
                    related: calendarID,
                    about: "EVENT"
                };
            }else if(this.props.type==="trading-equipment"){
                com = {
                    text: this.state.text,
                    related: calendarID,
                    about: "TRADING-EQUIPMENT"
                };
            }else if(this.props.type==="article"){
                com = {
                    text: this.state.text,
                    related: calendarID,
                    about: "ARTICLE"
                };
            }
            this.setState({loading:true});
            await this.props.postComment(com).then(async result=>{

               // await this.getEvents();
                this.props.resendComments();
                this.setState({text: "",rest:1000,loading:false})
            });



        }
    };

    render(){
        const comments  = this.props.data;
        let user=this.state.user;
        return(
            <Segment  loading={this.state.loading} style={{borderRadius:10,borderWidth:2,background: "rgba(0,0,0,0)"}}>

                <Header as='h4' inverted block style={{borderRadius:10, backgroundColor:colorBG, borderColor:'#212a2b', borderWidth:1.7}} textAlign={"left"}>
                    Comments
                </Header>
            <div id={"cgroup"} style={{overflow:"auto",height:"250px",backgroundColor:colorBG,borderRadius:10,borderWidth:2,borderColor:"white"}}>


                {comments.length>0?comments.map(item=>(

                        <div style={{backgroundColor:"#1d2526", borderTopLeftRadius:7, borderTopRightRadius:7, borderWidth:2,borderColor:colorAccent}}>
                        <br/>
                                <div style={{display:"flex",marginLeft:10,marginRight:20}}>
                                    <div style={{display:"flex",flex:1}}>
                                    <a   style={{marginLeft:10,marginRight:4,textAlign:"left"}} href={"/profile/"+item.userId}>
                                        <h5 >{item.username+" "+item.usersurname}</h5>
                                    </a>
                                    <div style={{fontSize:10,color:"grey"}}>
                                    {normalizeDateToTR(item.date)}
                                    </div>
                                    </div>
                                    {user && user.loggedIn&&user._id===item.userId?(

                                                    <Popup
                                                        flowing
                                                        on={"click"}
                                                        position={"bottom right"}
                                                        hoverable
                                                        hideOnScroll
                                                        trigger={

                                                                <a style={{fontSize:20,cursor:"pointer"}}>
                                                                    ...
                                                                </a>

                                                        }
                                                    >

                                                        <Button onClick={()=>this.deleteComment(item._id)} color={"red"} >Delete</Button>


                                                    </Popup>

                                        ):
                                        <div/>

                                    }

                                </div>
                                <Divider/>
                                <Comment.Text style={{color:"white",marginLeft:20,marginRight:20, backgroundColor:"#1d2526"}}>{item.text.length>100?
                                    (<div>{this.preview(item.text)}
                                            <Modal trigger={<div style={{backgroundColor:"#1d2526"}}><Button style={{backgroundColor:"#1d2526",color:colorAccent,shadowColor:"transparent", shadowOpacity: 0, padding:0}} size={"mini"}>Read More</Button></div>}>
                                                <Modal.Header>Comment</Modal.Header>
                                                <Modal.Content image>
                                                    <Icon size={"large"} name={"comment"} />
                                                    <Modal.Description>
                                                        <Header>
                                                            <p>{item.username+" "+item.usersurname}
                                                             <div style={{fontSize:12,color:"lightgray"}}>
                                                                {normalizeDate(item.date)}
                                                             </div>
                                                            </p>
                                                        </Header>
                                                        <p style={{overflowWrap:"break-word"}}>
                                                            {item.text}
                                                        </p>
                                                    </Modal.Description>
                                                </Modal.Content>
                                            </Modal>
                                        </div>
                                    ):item.text
                                }</Comment.Text>

                            <Divider/>
                        </div>

                    )
                ):<h3 style={{color:"gray"}}>No comments yet</h3>}

            </div>
                <Segment style={{backgroundColor:colorBG}} >

                    {this.state.user&&this.state.user.loggedIn?
                        (<Form >
                            <Form.TextArea maxLength={1000} style={{borderWidth:1,borderColor:"gray"}} value={this.state.text}  onChange={(item)=>this.setState({rest:1000-item.target.value.length,text:item.target.value})}/>

                            <div style={{display:"flex",flex:1}}>
                                <div style={{display:"flex",flexDirection:"row",flex:3}}/>
                                <div style={{display:"flex",flexDirection:"row",justifyContent:"center",flex:3}}>

                                    <Button onClick={this.onSubmit} content='Send Comment'
                                            style={{borderRadius:30, borderColor:"white", backgroundColor:"#1d2526", color:"white"}}
                                            labelPosition='left'
                                            icon={'edit'}

                                    />
                                </div>
                                <div style={{fontSize:14,color:"white",display:"flex",flexDirection:"row",justifyContent:"flex-end",alignItems:"flex-start",flex:3}}>
                                    {this.state.rest}
                                </div>
                            </div>
                        </Form>)
                        :
                        <h3>Sign in to make comments!</h3>}
                </Segment>
            </Segment>
        )
    }
}


const dispatchToProps = dispatch => {
    return {

        deleteComment:path=>dispatch(userActions.deleteComment(path)),
        postComment:params=>dispatch(userActions.postComment(params))
    };
};

export default connect(null, dispatchToProps)(Comments);
