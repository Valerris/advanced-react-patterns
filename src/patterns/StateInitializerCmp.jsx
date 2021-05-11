import { useState, useEffect } from "react"

/* 
	Components use explicit state between each other.
    Total control over rendering.

    !(The rendering resposibility is under the ownership of the user)!

    (Component is in charge of state,
        rendering is in charge of user)
*/

const callAllUtil = (...fns) => (...args) =>
	fns.forEach((fn) => fn && fn(...args))

export default function StateInitializerCmp(props) {
	const { initialOn = false, onToggle, onReset, children } = props

	const [on, setOn] = useState(initialOn)

	useEffect(() => {
		onToggle(on)
		onReset(on)
	}, [onToggle, onReset, on])

	const reset = () => {
		setOn(initialOn)
	}

	const toggleHandler = () => {
		setOn((on) => !on)
	}

	const getTogglerProps = ({ onClick, ...restProps } = {}) => ({
		onClick: callAllUtil(onClick, toggleHandler),
		"aria-expanded": on,
		...restProps,
	})

	const getStateAndHelpers = () => ({
		on,
		toggle: toggleHandler,
		reset,
		getTogglerProps,
	})

	return children(getStateAndHelpers())
}
