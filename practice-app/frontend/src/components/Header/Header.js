import React,{Component} from "react"
import {HeaderMenu,MenuItem,MenuButton} from "./StyledHeaderComponents"
import GuestComponent from "./GuestHeaderComponents";

class Header extends Component {
	constructor(props) {
		super(props)
		this.state={name: "lol",a:"b"}
	}
	onClick() {
		console.log("clicked");
		this.setState({name: "notlol"})
	}
	render() {
		return (
			<HeaderMenu>
				<MenuItem>
					<img style={{height: 64}} src="http://localhost:3000/logoarken.png"/>
				</MenuItem>
				<MenuButton
                    onClick={this.onClick.bind(this)}
				>
					Events
				</MenuButton>
				<MenuButton>
					Trading Equipments
				</MenuButton>
				<div style={{flexGrow: "1"}}/>

				<GuestComponent/>
			</HeaderMenu>
		)
	}
}

export default Header