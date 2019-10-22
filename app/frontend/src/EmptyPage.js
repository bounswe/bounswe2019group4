import React, { Component } from "react";

class EmptyPage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{position: "absolute", height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                <h1 style={{fontWeight: "bold", color: "#FFF"}}>Welcome to ArkenStone :)</h1>
            </div>
        )
    }
}

export default EmptyPage;