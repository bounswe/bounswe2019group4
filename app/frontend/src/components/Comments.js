import React, {Component} from "react";
import {Comment, Divider,Button,Modal,Image,Header,Icon,Popup} from "semantic-ui-react";
import {Link} from "react-router-dom";
import {normalizeDate} from "./Events/Events";
import {loadState} from "../_core/localStorage";
import * as userActions from "../actions/userActions";
import {connect} from "react-redux";


class Comments extends Component{


    state={
        user:{}
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

    render(){
        const comments  = this.props.data;
        let user=this.state.user;
        return(
            <div id={"cgroup"} style={{overflow:"auto",height:"250px",backgroundColor:"#fcfcfc",borderRadius:10,borderWidth:2,borderColor:"black"}}>


                {comments.length>0?comments.map(item=>(

                        <div style={{backgroundColor:"#F0F0F0"}}>

                                <div style={{display:"flex",marginLeft:10,marginRight:20}}>
                                    <div style={{display:"flex",flex:1}}>
                                    <a   style={{marginLeft:10,marginRight:4,textAlign:"left"}} href={"/profile/"+item.userId}>
                                        <h5 >{item.username+" "+item.usersurname}</h5>
                                    </a>
                                    <div style={{fontSize:10,color:"grey"}}>
                                    {normalizeDate(item.date)}
                                    </div>
                                    </div>
                                    {user.loggedIn&&user._id===item.userId?(

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
                                <Comment.Text style={{color:"#5F5F5F",marginLeft:20,marginRight:20}}>{item.text.length>100?
                                    (<div>{this.preview(item.text)}
                                            <Modal trigger={<Button size={"mini"}>read further</Button>}>
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
        )
    }
}


const dispatchToProps = dispatch => {
    return {

        deleteComment:path=>dispatch(userActions.deleteComment(path))

    };
};

export default connect(null, dispatchToProps)(Comments);
