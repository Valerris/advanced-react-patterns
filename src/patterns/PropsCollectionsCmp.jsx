import { useState, useEffect } from "react"

/* 
	Components use explicit state between each other.
    Total control over rendering.

    !(The rendering resposibility is under the ownership of the user)!

    (Component is in charge of state,
        rendering is in charge of user)
*/

export default function PropsCollectionsCmp(props) {
	const { onToggle, children } = props

	const [on, setOn] = useState(false)

	useEffect(() => onToggle(on), [onToggle, on])

	const toggleHandler = () => {
		setOn((on) => !on)
	}

	const getStateAndHelpers = () => ({
		on,
		toggle: toggleHandler,
		togglerProps: {
			"aria-expanded": on,
			onClick: toggleHandler,
		},
	})

	return children(getStateAndHelpers())
}
