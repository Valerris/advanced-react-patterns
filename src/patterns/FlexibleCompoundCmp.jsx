import React, { useState, useEffect } from "react"
import Switch from "components/Switch"

/* 
	Components use their own implicit state.

	!(The rendering resposibility is under the ownership of the Component itself)!

	(Component is in charge of state and rendering)
*/

const ToggleCtx = React.createContext({
	on: false,
	toggle: () => {},
})

export default function FlexibleCompoundCmp(props) {
	const { onToggle, children } = props

	const toggleHandler = () => {
		setState((state) => ({ ...state, on: !state.on }))
	}

	const [state, setState] = useState({
		on: false,
		toggle: toggleHandler,
	})

	useEffect(() => onToggle(state.on), [onToggle, state.on])

	return (
		<ToggleCtx.Provider value={state}>{children}</ToggleCtx.Provider>
	)
}

FlexibleCompoundCmp.TextOn = (props) => {
	const { children } = props

	return (
		<ToggleCtx.Consumer>
			{(ctxValue) => (ctxValue.on ? children : null)}
		</ToggleCtx.Consumer>
	)
}

FlexibleCompoundCmp.TextOff = (props) => {
	const { children } = props

	return (
		<ToggleCtx.Consumer>
			{(ctxValue) => (ctxValue.on ? null : children)}
		</ToggleCtx.Consumer>
	)
}

FlexibleCompoundCmp.Button = () => {
	return (
		<ToggleCtx.Consumer>
			{(ctxValue) => (
				<Switch on={ctxValue.on} onClick={ctxValue.toggle} />
			)}
		</ToggleCtx.Consumer>
	)
}
