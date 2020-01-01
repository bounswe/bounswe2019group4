import React, {Component} from 'react';
import {Button, Input, List, Popup, Segment} from "semantic-ui-react";
import Annotation from "react-image-annotation/lib/components/Annotation";
import annotationFactory from "../../factories/annotationFactory";
import _ from "lodash";
import styled from 'styled-components'
import {colorAccent} from "../../utils/constants/Colors";
import history from "../../_core/history";
import authFactory from "../../factories/authFactory";
import {loadState} from "../../_core/localStorage";

const Container = styled.div`
  background: white;
  border-radius: 2px;
  box-shadow:
    0px 1px 5px 0px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14),
    0px 3px 1px -2px rgba(0, 0, 0, 0.12);
  padding: 8px 16px;
  margin-top: 8px;
  margin-left: 8px;
`

export default class Simple extends Component {
    state = {
        annotations: [],
        annotation: {}
    }



    componentDidMount() {
        annotationFactory.getSpecificAnnotation("/article/"+this.props.articleId).then(result => {
            console.log(result);
            const annotations = _.filter(result.data,function(o) { return o.body.type === "Image" ; }).map(item => {
                return {
                    id: item._id,
                    ETag: item.ETag,
                    geometry: {
                        x: item.body.x*100,
                        y: item.body.y*100,
                        height: item.body.h*100,
                        width: item.body.w*100,
                        type: "RECTANGLE"
                    },
                    data: {
                        userId: item.body.userId,
                        articleId: item.articleId,
                        text: item.body.annotationText,
                        "username":item.body.username
                    }
                }
            })
            this.setState({annotations})
        })
    }

    onChange = (annotation) => {
        this.setState({ annotation })
    }

    onSubmit = (annotation) => {
        const { geometry, data } = annotation
        console.log(geometry);

        annotationFactory.addAnnotation({
            "@context": "http://www.w3.org/ns/anno.jsonld",
            articleId: this.props.articleId,
            "body": {
                "username":loadState().user.name+" "+loadState().user.surname,
                annotationText: data.text,
                "articleId": this.props.articleId,
                "finishIndex": this.props.end,
                "h": geometry.height/100,
                "startIndex": this.props.start,
                "type": "Image",
                "userId": this.props.userId,
                "w": geometry.width/100,
                "x": geometry.x/100,
                "y": geometry.y/100
            },
            "target": "http://www.example.com/index.htm",
            "type": "Annotation"
        }).then(()=> {
            annotationFactory.getSpecificAnnotation("/article/"+this.props.articleId).then(result => {
                const annotations = _.filter(result.data,function(o) { return o.body.type === "Image" ; }).map(item => {
                    return {
                        ...item,

                        geometry: {
                            x: item.body.x*100,
                            y: item.body.y*100,
                            height: item.body.h*100,
                            width: item.body.w*100,
                            type: "RECTANGLE"
                        },
                        data: {
                            userId: item.body.userId,
                            articleId: item.articleId,
                            text: item.body.annotationText,
                            "username":item.body.username

                        }
                    }
                })
                this.setState({annotations})
            })
        })

        this.setState({
            annotation: {},

            annotations: this.state.annotations.concat({
                geometry,
                data: {
                    ...data,
                    id: Math.random()
                }
            })
        })
    }

    deleteAnno=async (item)=>{
        this.setState({loading:true})
        console.log(item);
        await annotationFactory.delete({"E-Tag":item.ETag}).then(()=>{
            annotationFactory.getSpecificAnnotation("/article/"+this.props.articleId).then(result => {
                const annotations = _.filter(result.data,function(o) { return o.body.type === "Image" ; }).map(item => {
                    return {
                        ...item,
                        geometry: {
                            x: item.body.x*100,
                            y: item.body.y*100,
                            height: item.body.h*100,
                            width: item.body.w*100,
                            type: "RECTANGLE"
                        },
                        data: {
                            userId: item.body.userId,
                            articleId: item.articleId,
                            text: item.body.annotationText,
                            "username":item.body.username

                        }
                    }
                })
                this.setState({annotations, loading: false})
            })
        })
    };

    editAnno=async(item)=>{
        this.setState({loading:true})
        let a={
            _id:item.id,
            id:"https://anno.arkenstone.ml/annotations/"+item.id,
            "body": {
                annotationText:this.state.annotationText,
                "articleId": this.props.articleId,
                "finishIndex": this.props.end,
                "h": 0,
                "startIndex": this.props.start,
                "type": "Text",
                "userId": loadState().user._id,
                "w": 0,
                "x": 0,
                "y": 0,
                "username":loadState().user.name+" "+loadState().user.surname
            },
            created:item.date,
            modified:item.modifDate,
            "target": "http://www.example.com/index.htm",
            "type": "Annotation"
        }
        await annotationFactory.modifyAnnotation(a).then(()=>{
            annotationFactory.getSpecificAnnotation("/article/"+this.props.articleId).then(result => {
                const annotations = _.filter(result.data,function(o) { return o.body.type === "Image" ; }).map(item => {
                    return {
                        ...item,
                        geometry: {
                            x: item.body.x*100,
                            y: item.body.y*100,
                            height: item.body.h*100,
                            width: item.body.w*100,
                            type: "RECTANGLE"
                        },
                        data: {
                            userId: item.body.userId,
                            articleId: item.articleId,
                            text: item.body.annotationText,
                            "username":item.body.username

                        }
                    }
                })
                this.setState({annotations})
            })
        });
    }

    renderHighlight = ({annotation}) => {
        let commented= false;
        return (
            /*
            <Container
                style={{
                    position: 'absolute',
                    left: `${annotation.geometry.x}%`,
                    top: `${annotation.geometry.y + annotation.geometry.height}%`,
                }}
                geometry={annotation.geometry}
            >
                {annotation.data && annotation.data.text}
                <Button size="small">Delete</Button>
            </Container>

             */

             (
                /*
                <mark
                    style={{backgroundColor: props.color || '#84d2ff', padding: '0 4px'}}
                    data-start={props.start}
                    data-end={props.end}
                    onClick={() => props.onClick({start: props.start, end: props.end})}
                >
                    {props.content}
                    {props.tag && (
                        <span style={{fontSize: '0.7em', fontWeight: 500, marginLeft: 6}}>{props.tag}</span>
                    )}
                </mark>
                */
                <Popup on='click' pinned trigger={
                    <div style={{position: "absolute", zIndex:"2" ,marginLeft: annotation.geometry.x+"%", marginTop: annotation.geometry.y+"%", width: annotation.geometry.width+"%", height: annotation.geometry.height+"%", border: "5px solid red"}}></div>
                }
                       flowing hoverable>
                        <div>
                                <Segment id={"annGroup"} textAlign="left" style={{display:"flex",flexDirection:"column",alignItems:"center",borderWidth:2,borderRadius:10,borderColor:"lightgrey",color:"lightgrey",maxHeight:200,overflowY:"auto"}}>
                                    <List divided relaxed>
                                        {
                                            this.state.annotations.map(item=>{

                                                if(item.geometry.x===annotation.geometry.x&&item.geometry.y===annotation.geometry.y){
                                                    if(item.data.userId===loadState().user._id) { commented= true }
                                                    return (
                                                        <List.Item>
                                                            <List.Icon name={"comment"} />
                                                            <List.Content>
                                                                <List.Header style={{overflow:"hidden",color:"grey"}}>
                                                                    {item.data.text}
                                                                </List.Header>
                                                                <List.Description style={{fontSize:12}}>
                                                                    <span style={{cursor:"pointer",color:"blue"}} onClick={()=>history.push("/profile/"+item.data.userId)}>{item.data.username}</span>
                                                                </List.Description>
                                                                {
                                                                    authFactory.isUserLoggedIn()&&item.data.userId===loadState().user._id&&(
                                                                        <div>
                                                                            <Button size={"mini"} color={"red"} onClick={()=>this.deleteAnno(item)}>X</Button>
                                                                        </div>
                                                                    )
                                                                }
                                                            </List.Content>
                                                        </List.Item>)
                                                }
                                            })
                                        }
                                    </List>



                                </Segment>
                            {loadState().user && loadState().user.loggedIn &&
                            <Input
                                disabled={commented}
                                value={annotation.data.annotationText}
                                onChange={this.onChange.bind(this)}
                                placeholder="AnnotationText"
                                action={<Button disabled={!annotation.data.annotationText} content="Annotate"/>}/>
                            }
                            </div>
                </Popup>
            )
        )
    }

    render () {
        const {img} = this.props;
        return (
                <Annotation
                    src={img}
                    alt='Two pebbles anthropomorphized holding hands'
                    annotations={this.state.annotations}
                    renderHighlight={this.renderHighlight.bind(this)}
                    type={this.state.type}
                    value={this.state.annotation}
                    onChange={this.onChange}
                    onSubmit={this.onSubmit}
                />
        )
    }
}