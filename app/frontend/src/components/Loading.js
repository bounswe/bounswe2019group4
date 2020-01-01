import React, {Component} from "react";

class Loading extends Component {


    render(){
        return(
        <div className="ui active dimmer">
            <div className="ui active text loader" style={{color: "white", fontSize: 30}}>Loading</div>
        </div>
        )
    }
}
export default Loading;