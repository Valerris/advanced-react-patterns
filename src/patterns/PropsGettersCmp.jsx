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

export default function PropsGettersCmp(props) {
	const { onToggle, children } = props

	const [on, setOn] = useState(false)

	useEffect(() => onToggle(on), [onToggle, on])

	const toggleHandler = () => {
		setOn((on) => !on)
	}

	const getTogglerProps = ({ onClick, ...restProps }) => ({
		onClick: callAllUtil(onClick, toggleHandler),
		"aria-expanded": on,
		...restProps,
	})

	const getStateAndHelpers = () => ({
		on,
		toggle: toggleHandler,
		getTogglerProps,
	})

	return children(getStateAndHelpers())
}
