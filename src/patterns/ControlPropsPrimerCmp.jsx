import React, { useState } from "react"
import Switch from "components/Switch"

/* 
	Components share state between each other and react on its changes simultaneously.

    Components synchronize state between each other.

    State can come from props or from state.
    !(Do not synchronize state and props)!

    !(Controlled form elements pattern)!
*/

export function ControlPropsPrimerPattern(props) {
	const { on, onToggle = () => {} } = props

	const [state, setState] = useState(false)

	const isOnControlled = () => on !== undefined

	const getState = () => (isOnControlled ? on : state)

	const toggleHandler = () => {
		if (isOnControlled()) {
			onToggle(!getState())
		} else {
			setState((on) => !on)
			// onToggle(getState())
		}
	}

	return <Switch on={getState()} onClick={toggleHandler} />
}

export default function ControlPropsPrimerCmp(props) {
	const [bothOn, setBothOn] = useState(false)

	const toggle = (on) => setBothOn(on)

	return (
		<div>
			<ControlPropsPrimerPattern on={bothOn} onToggle={toggle} />
			<ControlPropsPrimerPattern on={bothOn} onToggle={toggle} />
		</div>
	)
}
