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
        annotationFactory.getSpecificAnnotation("/"+this.props.articleId).then(result => {
            const annotations = _.filter(result,function(o) { return o.body.type === "Image" ; }).map(item => {
                return {
                    geometry: {
                        x: item.body.x,
                        y: item.body.y,
                        height: item.body.h,
                        width: item.body.w,
                        type: "RECTANGLE"
                    },
                    data: {
                        text: item.body.annotationText
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
        console.log(annotation);

        annotationFactory.addAnnotation({
            "@context": "http://www.w3.org/ns/anno.jsonld",
            articleId: this.props.articleId,
            "body": {
                annotationText: data.text,
                "articleId": this.props.articleId,
                "finishIndex": this.props.end,
                "h": geometry.height,
                "startIndex": this.props.start,
                "type": "Image",
                "userId": this.props.userId,
                "w": geometry.width,
                "x": geometry.x,
                "y": geometry.y
            },
            "target": "http://www.example.com/index.htm",
            "type": "Annotation"
        }).then(()=> {
            annotationFactory.getSpecificAnnotation("/"+this.props.articleId).then(result => {
                const annotations = _.filter(result,function(o) { return o.body.type === "Image" ; }).map(item => {
                    return {
                        geometry: {
                            x: item.body.x,
                            y: item.body.y,
                            height: item.body.h,
                            width: item.body.w,
                            type: "RECTANGLE"
                        },
                        data: {
                            text: item.body.annotationText
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

    renderHighlight = ({annotation}) => {
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
                <Popup on='click' pinned trigger={<svg>
                    <rect x={annotation.geometry.x} y={annotation.geometry.y} height={annotation.geometry.height} width={annotation.geometry.width}
                          style={{stroke: ":#ff0000", fill: "rgba(0,0,0,0,5)"}}/>
                </svg>}
                       flowing hoverable>
                        (<div>
                                <Segment id={"annGroup"} textAlign="left" style={{display:"flex",flexDirection:"column",alignItems:"center",borderWidth:2,borderRadius:10,borderColor:"lightgrey",color:"lightgrey",maxHeight:200,overflowY:"auto"}}>
                                    <List divided relaxed>
                                        {
                                            this.state.annotations.map(item=>{

                                                if(item.x===annotation.geometry.x&&item.y===annotation.geometry.y){
                                                    return (
                                                        <List.Item>
                                                            <List.Icon name={"comment"} />
                                                            <List.Content>
                                                                <List.Header style={{overflow:"hidden",color:"grey"}}>
                                                                    {item.annotext}
                                                                </List.Header>
                                                                <List.Description style={{fontSize:12}}>
                                                                    <span style={{cursor:"pointer",color:"blue"}} onClick={()=>history.push("/profile/"+item.userid)}>{item.author}</span> in {item.date}
                                                                </List.Description>
                                                                {
                                                                    authFactory.isUserLoggedIn()&&item.userid===loadState().user._id&&(
                                                                        <div>
                                                                            <Button size={"mini"} color={"red"} onClick={()=>this.deleteAnno(item)}>X</Button>
                                                                            <Button size={"mini"} color={"yellow"} onClick={()=>this.editAnno(item)}>edit</Button>
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

                                <Input
                                    value={annotation.data.annotationText}
                                    onChange={this.onChange.bind(this)}
                                    placeholder="AnnotationText" action={<Button  disabled={!annotation.data.annotationText} content="Annotate" />}/>
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