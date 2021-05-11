import { useState } from "react"
import Switch from "components/Switch"

/* 
	State Reducer With Change Types Pattern controls how the logic works.
	It controls how the state is managed based on its Change Types.
*/

const stateChangeTypes = {
	toggle: "__toggle__",
	reset: "__reset__",
	forced: "__forced__",
}

const callAllUtil = (...fns) => (...args) =>
	fns.forEach((fn) => fn && fn(...args))

export function StateReducerWithChangeTypesPattern(props) {
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
				.map((c) => {
					const { type: ignoredType, ...remainingChanges } = c

					return Object.keys(remainingChanges).length
						? remainingChanges
						: null
				})[0]
		})
	}

	const reset = () => {
		internalSetState((prevState) => ({
			type: stateChangeTypes.reset,
			...prevState,
			on: initialOn,
		}))

		onReset(state.on)
	}

	const toggleHandler = ({ type = stateChangeTypes.toggle } = {}) => {
		internalSetState((prevState) => ({
			type,
			...prevState,
			on: !prevState.on,
		}))

		onToggle(state.on)
	}

	const getTogglerProps = ({ onClick, ...restProps } = {}) => ({
		onClick: callAllUtil(onClick, () => toggleHandler()),
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

export default function StateReducerWithChangeTypesCmp(props) {
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
		if (changes.type === stateChangeTypes.forced) {
			return changes
		}

		if (timesClicked >= 4) {
			return { ...changes, on: false }
		}

		return changes
	}

	return (
		<StateReducerWithChangeTypesPattern
			initialOn={true}
			stateReducer={toggleStateReducer}
			onToggle={handleToggle}
			onReset={handleReset}
		>
			{({ on, toggle, reset, getTogglerProps }) => (
				<div>
					<Switch
						{...getTogglerProps({
							on: on,
						})}
					/>
					{timesClicked > 4 ? (
						<div data-testid="notice">
							Whoa, you clicked too much!
							<br />
							<button
								onClick={() => {
									console.log("forced")

									toggle({ type: stateChangeTypes.forced })
								}}
							>
								Force Toggle
							</button>
							<br />
						</div>
					) : timesClicked > 0 ? (
						<div data-testid="click-count">
							Click count: {timesClicked}
						</div>
					) : null}
					<button onClick={reset}>Reset</button>
				</div>
			)}
		</StateReducerWithChangeTypesPattern>
	)
}
