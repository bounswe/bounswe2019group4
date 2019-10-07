import React, { Component } from "react";

class EmptyPage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{position: "absolute", height: "100%", width: "100%", backgroundColor: "#BEBEBE", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                <h1>Sorry :(</h1>
                <h2>This page isn't initialized yet.</h2>
            </div>
        )
    }
}

export default EmptyPage;