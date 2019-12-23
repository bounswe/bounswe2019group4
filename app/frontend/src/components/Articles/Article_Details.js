import React, {Component} from 'react';
import {loadState} from '../../_core/localStorage'
import {
    Header,
    Segment,
    Table,
    Comment,
    Form,
    Button,
    Card,
    Divider,
    Grid,
    Rating,
    List,
    Popup,
    Image,
    Icon,
    Label,
    Dimmer
} from 'semantic-ui-react';
import {connect} from 'react-redux';
import * as userActions from '../../actions/userActions';
import {normalizeDate} from "../Events/Events";
import Loading from "../Loading";
import article_photo from "../../assets/article_logo.png"
import Comments from "../Comments";


class Article_Details extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user:{},
            loading:false,
            rest:1000,
            text:"",
            titletext:"",
            editloading:false,
            ratesubmitted:false,
            dimmer:false,

        }
    }


    async componentDidMount() {

        const localState = loadState();
        this.setState({user: localState.user});
        await this.getArticle();
        //await this.getRating();
    }

    componentDidUpdate(props) {
        if(props.match.params.id !== this.props.match.params.id) {
            this.getArticle();
        }
    }


    getArticle=async()=>{

        await this.props.article("/"+this.props.match.params.id).then(async result=> {
                let newarticle=result.value;
                this.setState({article:newarticle,text:newarticle.text,titletext:newarticle.title})
            return newarticle.imageId;
            }
        ).then((a)=>{
            let src=require("../../assets/article_photos/article"+a+".jpg")
            this.setState({src});

        })


    }

    handlerate=async (e, { rating, maxRating })=>{

        let rate={
            value:rating
        };
        await this.props.rateArticle("/"+this.props.match.params.id+"/rate",rate).then(result=>{
            this.getArticle();
        });
        this.setState({ratesubmitted:true});
        setTimeout(()=>this.setState({ratesubmitted:false}),3000);

    };

    onSubmit=async ()=>{

        let param={
            text:this.state.text,
            title:this.state.titletext
        };
        this.setState({editloading:true});
        await this.props.editArticle("/"+this.state.article._id,param).then(()=>{
            this.setState({editloading:false});
            this.setState({dimmer:true});
            setTimeout(()=>this.setState({dimmer:false}),2000);

        })

    };

    render() {
        const article  = this.state.article;
        const comments=article?article.comments:[];
        let rating=article?article.rateAverage:0;
            rating=rating?rating.toFixed(1):0;
        let user=this.state.user;
        let active=this.state.dimmer;
        return (

            article?(
                <div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                    <div style={{width:"100%"}}>
                        <Grid>


                            <Grid.Column width={4} >
                                <Segment  textAlign="left" style={{marginRight:50,marginLeft:20,display:"flex",flexDirection:"column",alignItems:"center",borderWidth:2,borderRadius:10,backgroundColor:"#f9f9f9"}}>
                                    {<Image size="medium" src={this.state.src} />}

                                    <List relaxed>
                                        <List.Item>
                                            <List.Icon name={"user"}/>
                                            <List.Content>
                                                <a href={"/profile/"+article.userId}>{article.username+" "+article.usersurname}</a>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <List.Icon name={"calendar alternate"}/>
                                            <List.Content>
                                                {normalizeDate(article.date)}
                                            </List.Content>
                                        </List.Item>

                                    </List>
                                    <Button as='div' labelPosition='right'>
                                        {user&&user.loggedIn?
                                            <Popup
                                                flowing
                                                hoverable
                                                position={"bottom center"}
                                                trigger={
                                                    <Button color='blue'>
                                                        Rate
                                                    </Button>
                                                }
                                            >

                                                <Rating
                                                    icon={"star"}
                                                    onRate={this.handlerate}
                                                    defaultRating={article.yourRate}
                                                    maxRating={5}

                                                />
                                            </Popup>:
                                            null
                                        }
                                        <Label as='a' basic color='#396D7C' pointing='left'>
                                            <Icon color={"grey"} size={"large"}
                                                  style={{marginRight: 3}} name={"star"}/>
                                            {rating}
                                        </Label>
                                        <Label as='a' basic color='#396D7C' pointing='left'>
                                            <Icon color={"grey"} size={"large"}
                                                  style={{marginRight: 3}} name={"users"}/>
                                            {article.numberOfRates}
                                        </Label>
                                    </Button>
                                    {this.state.ratesubmitted?
                                        <h5>Your rate has been submitted.</h5>:<div/>
                                    }

                                </Segment>
                            </Grid.Column>
                            <Grid.Column width={10}>
                                <Segment raised piled padded compact style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                                    <div style={{margin:20,fontFamily:"timesnewroman",fontSize:15,width:"80%"}}>

                                        {user && user.loggedIn&&article.userId===user._id ? (
                                                <Header style={{fontFamily: "timesnewroman"}}>
                                                    Edit your article
                                                </Header>
                                            ) :
                                            (
                                                <Header style={{fontFamily: "timesnewroman"}}>
                                                    {article.title}
                                                </Header>
                                            )
                                        }
                                        {user && user.loggedIn&&article.userId===user._id ? (
                                            <Dimmer.Dimmable dimmed={active}>
                                                <Form
                                                loading={this.state.editloading}
                                                >
                                                    <Form.TextArea
                                                        label={"Title"}
                                                        style={{borderWidth: 1, borderColor: "gray",height:60}}
                                                        value={this.state.titletext}
                                                        onChange={(item) => this.setState({
                                                            titletext: item.target.value
                                                        })}
                                                    />
                                                    <Form.TextArea
                                                                    label={"Text"}
                                                                   style={{borderWidth: 1, borderColor: "gray",height:500}}
                                                                   value={this.state.text}
                                                                   onChange={(item) => this.setState({
                                                                       text: item.target.value
                                                                   })}
                                                    />

                                                    <div style={{display: "flex", flex: 1}}>
                                                        <div style={{display: "flex", flexDirection: "row", flex: 3}}/>
                                                        <div style={{
                                                            display: "flex",
                                                            flexDirection: "row",
                                                            justifyContent: "center",
                                                            flex: 3
                                                        }}>

                                                            <Button onClick={this.onSubmit} content='Submit'
                                                                    labelPosition='left'
                                                                    icon={'edit'}
                                                                    basic color={"black"}
                                                            />
                                                        </div>
                                                        <div style={{
                                                            fontSize: 14,
                                                            display: "flex",
                                                            flexDirection: "row",
                                                            justifyContent: "flex-end",
                                                            alignItems: "flex-start",
                                                            flex: 3
                                                        }}>

                                                        </div>
                                                    </div>
                                                </Form>
                                                <Dimmer
                                                    active={active}
                                                    onClickOutside={this.handleHide}
                                                >
                                                    Your article has been edited!
                                                </Dimmer>
                                            </Dimmer.Dimmable>
                                            )
                                            : (
                                                <p style={{textAlign:"justify"}}>
                                                    {article.text}
                                                </p>
                                            )
                                        }
                                    </div>
                                </Segment>
                                <Comments type={"article"} _id={this.props.match.params.id} resendComments={this.getArticle}  data={comments}/>
                            </Grid.Column>

                        </Grid>


                    </div>

                </div>

            ):(<Loading/>)



        )
    }
}

const dispatchToProps = dispatch => {
    return {
        article: params => dispatch(userActions.getArticleDetails(params)),
        userInformation:params=>dispatch(userActions.users(params)),
        rateArticle:(path,params)=>dispatch(userActions.rateArticle(path,params)),
        editArticle:(path,params)=>dispatch(userActions.editArticle(path,params))
    };
};

export default connect(null, dispatchToProps)(Article_Details);
