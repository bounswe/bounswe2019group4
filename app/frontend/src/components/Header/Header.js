import React, {Component} from 'react';


class Header extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className="arken-header" style={{display: "flex", justifyContent: "space-between", height: 50, backgroundColor: "#eaceb4"}} >
                <div className="arken-header-logo" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <img src="../../assets/cropped_arken_logo.png" style={{maxHeight: "80%", marginLeft: 10}} />
                </div>
                <div className="arken-header-menu-group" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <div className="menu-item" id="menu-item-events" style={{margin: 20, color: "#8f6c3f", fontWeight: "900"}}>
                        Events
                    </div>
                    <div className="menu-item" id="menu-item-trading-equipment" style={{margin: 20, color: "#8f6c3f", fontWeight: "900"}}>
                        Trading Equipment
                    </div>
                    <div className="menu-item" id="menu-item-transactions" style={{margin: 20, color: "#8f6c3f", fontWeight: "900"}}>
                        Transactions
                    </div>
                </div>
                <div className="arken-header-user-group" style={{display: "flex", justifyContent:"flex-end", alignItems: "center"}}>
                    <div className="user-item" id="user-item-profile-picture">
                        <i className="fas fa-user-circle fa-2x" style={{height: "100%", margin: 10}} />
                    </div>
                    <div className="user-item" id="user-item-settings">
                        <i className="fas fa-cog" style={{height: "100%", margin: 10}} />
                    </div>
                </div>
            </div>
        )
    }

}

export default Header;