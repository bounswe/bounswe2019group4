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
    Label
} from 'semantic-ui-react';
import {connect} from 'react-redux';
import * as userActions from '../../actions/userActions';
import {normalizeDate} from "../Events/Events";
import Loading from "../Loading";
import article_photo from "../../assets/article_photo.png"

class Article_Details extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user:{},
            rating:0,
            loading:false,
            rest:1000,
            text:""
        }
    }


    async componentDidMount() {

        const localState = loadState();
        this.setState({user: localState.user});
        await this.getArticle();
        //await this.getRating();
    }


    async getArticle(){

        await this.props.article("/"+this.props.match.params.id).then(async result=> {
                let newarticle=result.value;
                this.setState({article:newarticle})

            }
        )

    }

    handlerate=async (e, { rating, maxRating })=>{

        let rate={
            value:rating
        };
        await this.props.rateArticle("/"+this.props.match.params.id,rate).then(result=>{
            this.setState({rating:rating})
        });

    };

    render() {
        const article  = this.state.article;
        let rating=article?article.rateAverage:0;
        if(rating){
            rating=rating.toFixed(1);
        }
        //const comments=this.state.article.comments;
        return (

            article?(
                <div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                    <div style={{width:"100%"}}>
                        <Grid>
                            <Grid.Column width={1} >
                            </Grid.Column>
                            <Grid.Column width={4} >
                                <Segment  textAlign="left" style={{display:"flex",flexDirection:"column",alignItems:"center",borderWidth:2,borderRadius:10,backgroundColor:"#f9f9f9"}}>
                                    {<Image size="medium" src={article_photo} />}

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
                                        <Popup
                                            pinned
                                            on={"click"}
                                            position={"bottom center"}
                                            trigger={
                                                <Button color='blue'>
                                                    Rate
                                                </Button>
                                            }>
                                            <Popup
                                                on={"click"}
                                                position={"bottom center"}
                                                trigger={
                                                    <Rating
                                                        onRate={this.handlerate}
                                                        defaultRating={this.state.rating}
                                                        maxRating={5}
                                                        clearable
                                                    />}
                                            >
                                                You can clear by clicking the same star again
                                            </Popup>
                                        </Popup>
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

                                </Segment>
                            </Grid.Column>
                            <Grid.Column width={10}>
                                <Segment raised piled padded compact style={{display:"flex",flexDirection:"column",alignItems:"center",borderWidth:2,borderRadius:10,backgroundColor:"#f9f9f9"}}>
                                    <div style={{margin:20,fontFamily:"timesnewroman",fontSize:15}}>
                                        <Header style={{fontFamily:"timesnewroman"}}>
                                            {article.title}
                                        </Header>

                                        <p>
                                            {article.text}
                                        </p>
                                    </div>
                                </Segment>
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
        rateArticle:(path,params)=>dispatch(userActions.rateArticle(path,params))

    };
};

export default connect(null, dispatchToProps)(Article_Details);
