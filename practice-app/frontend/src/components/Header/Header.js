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

	onEventsClick() {
		history.push("/events")
	}

	onTEClick() {
		history.push("/t-equipments")
	}

	onConverterClick(){
		history.push("/t-equipments/converter")
	}

	render() {
		return (
			<HeaderMenu>
				<MenuItem>
					<MenuButton onClick={this.onHomeClick}>
					<img style={{height: 64}} src="/logoarken.png" alt='logo'/>
					</MenuButton>
				</MenuItem>
				<MenuButton onClick={this.onEventsClick} basic>
					Events
				</MenuButton>
				<MenuButton onClick={this.onTEClick} basic>
					Trading Equipments
				</MenuButton>
				<MenuButton onClick={this.onConverterClick} basic>
					Currency Converter
				</MenuButton>
				<div style={{flexGrow: "1"}}/>

				<Login/>
			</HeaderMenu>
		)
	}
}

export default Header