import React, {Component} from "react";
import {Comment, Divider,Button,Modal,Image,Header,Icon} from "semantic-ui-react";
import {Link} from "react-router-dom";
import {normalizeDate} from "./Events/Events";


export default class Comments extends Component{


    componentDidMount() {
        this.scrollBottom();
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
        return comment.substr(0,200);
    };

    render(){
        const comments  = this.props.data;

        return(
            <Comment.Group id={"cgroup"} style={{overflow:"auto",height:"250px",backgroundColor:"#fcfcfc",borderRadius:10}}>

                {comments.length>0?comments.map(item=>(

                        <Comment style={{backgroundColor:"white",borderRadius:10}}>
                            <Comment.Content >
                                <Comment.Author ><Link to={"/profile/"+item.userId}>{item.username+" "+item.usersurname}</Link></Comment.Author>
                                <Comment.Metadata >
                                    <span>{normalizeDate(item.date)}</span>
                                </Comment.Metadata>
                                <Comment.Text>{item.text.length>100?
                                    (<div>{this.preview(item.text)}
                                            <Modal trigger={<Button size={"mini"}>...</Button>}>
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

                            </Comment.Content>
                            <Divider/>
                        </Comment>

                    )




                ):<h3 style={{color:"gray"}}>No comments yet</h3>}

            </Comment.Group>
        )
    }
}