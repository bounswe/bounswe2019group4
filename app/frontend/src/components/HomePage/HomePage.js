import React, { Component } from "react";
import Slider from 'react-animated-slider';
import 'react-animated-slider/build/horizontal.css';
//import "normalize.css";
//import "style-animations.css";
//import "styles.css"
//import 'horizontal.css';


class HomePage extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {

        const slides = [
            { title: 'First item', description: 'Lorem ipsum'},
            { title: 'Second item', description: 'Lorem ipsum'}
        ];
        return (

            <Slider>
                {slides.map((slide, index) => <div key={index}>
                    <h2>{slide.title}</h2>
                    <div>{slide.description}</div>
                </div>)}
            </Slider>
        )
    }
}

export default HomePage;