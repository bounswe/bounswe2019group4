import React, { Component } from "react";
import Slider from 'react-animated-slider';
import 'react-animated-slider/build/horizontal.css';
import image1 from "./slide_image_1.png"
import image2 from "./slide_image_2.png"
import image3 from "./slide_image_3.png"
import image4 from "./slide_image_4.png"
import image5 from "./slide_image_5.png"

import "./normalize.css";
import "./style-animations.css";
import "./styles.css"
import './normalize.css';
import {Menu} from "semantic-ui-react";


class HomePage extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {

        const slides = [
            { title: 'Welcome to Arkenstone',
                description: 'Arkenstone is an interactive trading platform with full of people who are interested in trading and investing in financial markets worldwide',
                images:image1},
            { title: 'Connect',
                description: 'Connect with other finance enthusiasts like you. Follow their portfolios, articles and interact with them to stay up to date.',
                images:image2},
            { title: 'Invest',
                description: 'Invest in trading indices and currencies by becoming a Trader User. Not ready to invest? Stay as a Basic User and learn all about trading by using our platform.'
                ,images:image3},
            { title: 'Discover',
                description: 'Find out what is happening in financial markets all arround the world. Search and read about economic events to invest wisely',
                images:image4},
            { title: '',
                description: 'Arkenstone has a native Web and  Mobile(Andriod) platform to make things easier for you. Earn wherever you go and whenever you want!',
                images:image5}
        ];
        return (

            <Slider className="slider-wrapper" autoplay={2000} infinite={true} >
                {slides.map((slide, index) =>
                    <div key={index} className="inner slider-content">

                    <h1 style={{color: "#1678C2",fontSize: "30px"}}>{slide.title}</h1>
                    <img src={slide.images} width={300} height={300} mode='fit'/>
                    <p  style={{color: "#FFFFFF", fontSize: "20px" }} >{slide.description}</p>
                    <button  name="sign_up"
                             onClick={this.navigate}>Register</button>
                </div>)}
            </Slider>
        )
    }
}

export default HomePage;