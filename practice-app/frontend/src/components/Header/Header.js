import React,{Component} from "react"
import {HeaderMenu,MenuItem,MenuButton} from "./StyledHeaderComponents"
import GuestComponent from "./GuestHeaderComponents";
import {Button} from "semantic-ui-react";
import Login from "../login/Login"
import history from "../core/history"

class Header extends Component {
	constructor(props) {
		super(props)
		this.state={name: "lol",a:"b"}
	}
	onClick() {
		console.log("clicked");
		this.setState({name: "notlol"})
	}
	onHomeClick() {
		history.push("/")
	}

	render() {
		return (
			<HeaderMenu>
				<MenuItem>
					<Button onClick={this.onHomeClick.bind(this)}>
					<img style={{height: 64}} src="http://localhost:3000/logoarken.png"/>
					</Button>
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

				<Login/>
			</HeaderMenu>
		)
	}
}

export default Header