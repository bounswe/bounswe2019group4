import React, { Component } from "react";
import Slider from 'react-animated-slider';
import 'react-animated-slider/build/horizontal.css';
import image1 from "./slide_image_1.png"
import image2 from "./slide_image_2.png"
import image3 from "./slide_image_3.png"
import image4 from "./slide_image_4.png"
import image5 from "./slide_image_5.png"
import logo from "../../assets/arken_logo.png"
import plain_bg from "../../assets/plain_bg.png"
import {loadState} from "../../_core/localStorage";
import "./normalize.css";
import "./style-animations.css";
import "./styles.css"
import './normalize.css';
import {Menu} from "semantic-ui-react";
import history from "../../_core/history";
import {colorAccent, colorBG, colorLightBG} from "../../utils/constants/Colors";


class HomePage extends Component {



    state={
user:{}
    };
    navigateSignUp(e) {
        history.push("/sign_up");
    }

    navigateEvents(e) {
        history.push("/trading-equipment");
    }

    componentDidMount() {
        this.setState({user:loadState().user})
    }

    render() {

        const {user}=this.state;
        const slides = [
            { title: 'Welcome to Arkenstone',
                description: 'Arkenstone is an interactive trading platform with full of people who are interested in trading and investing in financial markets worldwide.',
                bg_images:plain_bg,
            images:logo},
            { title: 'Connect',
                description_1: 'Connect with other finance enthusiasts like you. Follow their portfolios, articles and interact with them to stay up to date.',
                description_2: 'Invest in trading indices and currencies by becoming a Trader User. Not ready to invest? Stay as a Basic User and learn all about trading by using our platform.',
                description_3: 'Find out what is happening in financial markets all around the world. Search and read about economic events to invest wisely.',
                bg_images:plain_bg},
            { title: 'Welcome to Arkenstone',
                description: 'Arkenstone is an interactive trading platform with full of people who are interested in trading and investing in financial markets worldwide.',
                bg_images:plain_bg,
                images:logo},
            { title: 'Connect',
                description_1: 'Connect with other finance enthusiasts like you. Follow their portfolios, articles and interact with them to stay up to date.',
                description_2: 'Invest in trading indices and currencies by becoming a Trader User. Not ready to invest? Stay as a Basic User and learn all about trading by using our platform.',
                description_3: 'Find out what is happening in financial markets all around the world. Search and read about economic events to invest wisely.',
                bg_images:plain_bg},


        ];
        return (

            <Slider className="slider-wrapper" autoplay={2500} infinite={true} >
                {slides.map((slide, index) =>
                    <div key={index} className="inner slider-content" style= {{ backgroundImage: "url("+slide.bg_images+")" }}>

                        {index%2 === 1 && <div style={{backgroundColor:colorBG}}> <div className="item_2">
                            <img class="img_class" src={image1}/>
                            <span className="caption">{slide.description_1}</span>
                        </div>
                        < div className="item_2">
                            <img class="img_class" src={image2}/>
                            <span className="caption">{slide.description_2}</span>
                            </div>
                            <div  className="item_2">
                            <img class="img_class" src={image3}/>
                            <span className="caption">{slide.description_3}</span>
                            </div>
                        </div>

                        }

                        {index%2 !== 1 && <img src={slide.images} width={350} height={300} mode='fit'/>}

                        {index%2 !== 1 && <div style={{backgroundColor:colorLightBG, padding:30}}> <h1 style={{fontSize:"45px", color:colorAccent}}>Join the Trading Revolution!
                        </h1></div>}
                        <br/>
                        {index%2 !== 1 &&  <p  style={{color: "#FFFFFF", fontSize: "25px", textAlign:"center", lineHeight:1.5, paddingLeft:400
                            , paddingRight:400, }} >{slide.description}</p>}
                        <br/>
                        {!user||!user.loggedIn ? <button style={{width:250, color:"white"}}  name="sign_up"
                             onClick={this.navigateSignUp}>Get Started Now</button> :
                            <button style={{width:250, color:"white"}} name="trading-equipment" onClick={this.navigateEvents}>Start Investing</button> }

                </div>)}
            </Slider>

        )
    }
}

export default HomePage;