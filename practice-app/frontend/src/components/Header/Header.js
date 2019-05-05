import React,{Component} from "react"
import {HeaderMenu,MenuItem,MenuButton} from "./StyledHeaderComponents"
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
					<MenuButton onClick={this.onHomeClick.bind(this)}>
					<img style={{height: 64}} src="http://localhost:3000/logoarken.png"/>
					</MenuButton>
				</MenuItem>
				<MenuButton
                    onClick={this.onClick.bind(this)}
					basic
				>
					Events
				</MenuButton>
				<MenuButton
				basic
				>
					Trading Equipments
				</MenuButton>
				<div style={{flexGrow: "1"}}/>

				<Login/>
			</HeaderMenu>
		)
	}
}

export default Header