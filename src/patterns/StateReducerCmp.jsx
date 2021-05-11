import { useState } from "react"
import Switch from "components/Switch"

/* 
	State Reducer Pattern controls how the logic works.
	It controls how the state is managed.
*/

const callAllUtil = (...fns) => (...args) =>
	fns.forEach((fn) => fn && fn(...args))

export function StateReducerPattern(props) {
	const {
		initialOn = false,
		stateReducer = (state, changes) => changes,
		onToggle = () => {},
		onReset = () => {},
		children,
	} = props

	const [state, setState] = useState({ on: initialOn })

	const internalSetState = (changes, cb) => {
		setState((prevState) => {
			return [changes]
				.map((c) =>
					typeof changes === "function" ? changes(prevState) : c
				)
				.map((c) => stateReducer(prevState, c) || {})
				.map((c) => (Object.keys(c).length ? c : null))[0]

			// const changesObj =
			// 	typeof changes === "function" ? changes(prevState) : changes

			// const reducedChanges = stateReducer(prevState, changesObj) || {}

			// return Object.keys(reducedChanges).length
			// 	? reducedChanges
			// 	: null
		})
	}

	const reset = () => {
		internalSetState((prevState) => ({
			...prevState,
			on: initialOn,
		}))

		onReset(state.on)
	}

	const toggleHandler = () => {
		internalSetState((prevState) => ({
			...prevState,
			on: !prevState.on,
		}))

		onToggle(state.on)
	}

	const getTogglerProps = ({ onClick, ...restProps } = {}) => ({
		onClick: callAllUtil(onClick, toggleHandler),
		"aria-expanded": state.on,
		...restProps,
	})

	const getStateAndHelpers = () => ({
		on: state.on,
		toggle: toggleHandler,
		reset,
		getTogglerProps,
	})

	return children(getStateAndHelpers())
}

export default function StateReducerCmp(props) {
	const { initialTimesClicked = 0, onToggle, onReset } = props

	const [timesClicked, setTimesClicked] = useState(
		initialTimesClicked
	)

	const handleToggle = (...args) => {
		setTimesClicked((prevState) => prevState + 1)
		onToggle(...args)
	}

	const handleReset = (...args) => {
		setTimesClicked(initialTimesClicked)
		onReset(...args)
	}

	const toggleStateReducer = (state, changes) => {
		if (timesClicked >= 4) {
			return { ...changes, on: false }
		}

		return changes
	}

	return (
		<StateReducerPattern
			initialOn={true}
			stateReducer={toggleStateReducer}
			onToggle={handleToggle}
			onReset={handleReset}
		>
			{(toggle) => (
				<div>
					<Switch
						{...toggle.getTogglerProps({
							on: toggle.on,
						})}
					/>
					{timesClicked > 4 ? (
						<div data-testid="notice">
							Whoa, you clicked too much!
							<br />
						</div>
					) : timesClicked > 0 ? (
						<div data-testid="click-count">
							Click count: {timesClicked}
						</div>
					) : null}
					<button onClick={toggle.reset}>Reset</button>
				</div>
			)}
		</StateReducerPattern>
	)
}
