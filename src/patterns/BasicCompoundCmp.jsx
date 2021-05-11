import React, { useState, useEffect } from "react"
import Switch from "components/Switch"

/* 
	Components use their own implicit state.

	!(The rendering resposibility is under the ownership of the Component itself)!

	(Component is in charge of state and rendering)
*/

export default function BasicCompoundCmp(props) {
	const { onToggle, children } = props

	const [on, setOn] = useState(false)

	useEffect(() => onToggle(on), [onToggle, on])

	const toggleHandler = () => {
		setOn((on) => !on)
	}

	return React.Children.map(children, (child) => {
		return React.cloneElement(child, {
			on,
			toggle: toggleHandler,
		})
	})
}

BasicCompoundCmp.TextOn = (props) => {
	const { on, children } = props

	return on ? children : null
}

BasicCompoundCmp.TextOff = (props) => {
	const { on, children } = props

	return on ? null : children
}

BasicCompoundCmp.Button = (props) => {
	const { on, toggle } = props

	return <Switch on={on} onClick={toggle} />
}
