import React, {Component} from 'react';
import {Button} from "semantic-ui-react";
import Annotation from "react-image-annotation/lib/components/Annotation";
import annotationFactory from "../../factories/annotationFactory";
import _ from "lodash";
import styled from 'styled-components'

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
        annotationFactory.getArticleAnnotation({id: this.props.articleId}).then(result => {
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
            annotationFactory.getArticleAnnotation({id: this.props.articleId}).then(result => {
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

    renderContent = ({annotation}) => {
        return (
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
        )
    }

    render () {
        const {img} = this.props;
        return (
                <Annotation
                    src={img}
                    alt='Two pebbles anthropomorphized holding hands'
                    annotations={this.state.annotations}
                    //renderContent={this.renderContent}
                    type={this.state.type}
                    value={this.state.annotation}
                    onChange={this.onChange}
                    onSubmit={this.onSubmit}
                />
        )
    }
}