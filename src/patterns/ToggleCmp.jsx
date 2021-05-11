import { useState, useEffect } from "react"
import Switch from "components/Switch"

export default function Toggle(props) {
	const { onToggle } = props

	const [on, setOn] = useState(false)

	useEffect(() => onToggle(on), [onToggle, on])

	const toggleHandler = () => {
		setOn((on) => !on)
	}

	return <Switch on={on} onClick={toggleHandler} />
}
