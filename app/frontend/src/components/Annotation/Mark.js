import * as React from 'react'
import {Popup, Button, Grid, Input} from 'semantic-ui-react';
import annotationFactory from '../../factories/annotationFactory';


class Mark extends React.Component {
    constructor(props) {
        super(props);
        this.state= {annotationText: ""}
    }

    onChange(e, data) {
        this.setState({annotationText: data.value});
    }

    submit() {
        const {annotationText } = this.state;
        annotationFactory.addAnnotation({
            "@context": "http://www.w3.org/ns/anno.jsonld",
            articleId: this.props.articleId,
            "body": {
                annotationText,
                "articleId": this.props.articleId,
                "finishIndex": this.props.end,
                "h": 0,
                "startIndex": this.props.start,
                "type": "Text",
                "userId": "5dd776b0192f9d13dc38e847",
                "w": 0,
                "x": 0,
                "y": 0
            },
            "target": "http://www.example.com/index.htm",
            "type": "Annotation"
        })
        this.props.annotate(this.state.annotationText);
    }

    render() {
        const props = this.props;
        const {annotationText} = this.state;
        return (
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
            <Popup on='click' pinned trigger={<span style={{textDecoration: "underline"}}
                                                    data-start={props.start}
                                                    data-end={props.end}
                //onClick={() => props.onClick({start: props.start, end: props.end})}
            >{props.content}</span>} flowing hoverable>
                {props.tag ?
                    (props.tag) :
                    (<Input
                        value={annotationText}
                        onChange={this.onChange.bind(this)}
                        placeholder="AnnotationText" action={<Button disabled={!annotationText} onClick={this.submit.bind(this)} content="Annotate" />}/>)
                }
            </Popup>
        )
    }
}

export default Mark