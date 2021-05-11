import React from "react"
import hoistNonReactStatics from "hoist-non-react-statics"
import * as redux from "redux"
import Switch from "components/Switch"

const RenduxContext = React.createContext({})

class RenduxPattern extends React.Component {
	static Consumer = RenduxContext.Consumer
	static defaultProps = {
		initialState: {},
		reducer: (state) => state,
	}
	initialReduxState = this.props.initialState
	rootReducer = (state, action) => {
		if (action.type === "__RENDUX_RESET__") {
			return this.initialReduxState
		}
		return this.props.reducer(state, action)
	}
	store = redux.createStore(this.rootReducer, this.initialReduxState)
	reset = () => {
		this.store.dispatch({
			type: "__RENDUX_RESET__",
		})
	}
	componentDidMount() {
		this.unsubscribe = this.store.subscribe(() =>
			this.setState({
				state: this.store.getState(),
			})
		)
	}
	componentWillUnmount() {
		this.unsubscribe()
	}
	initialState = {
		state: this.props.initialState,
		dispatch: this.store.dispatch,
		reset: this.reset,
	}
	state = this.initialState
	render() {
		const { children } = this.props
		const ui =
			typeof children === "function" ? children(this.state) : children
		return (
			<RenduxContext.Provider value={this.state}>
				{ui}
			</RenduxContext.Provider>
		)
	}
}

function withRendux(Component) {
	class Wrapper extends React.Component {
		render() {
			const { forwardedRef, ...rest } = this.props
			return (
				<RenduxPattern.Consumer>
					{(rendux) => (
						<Component {...rest} rendux={rendux} ref={forwardedRef} />
					)}
				</RenduxPattern.Consumer>
			)
		}
	}
	Wrapper.displayName = `withRendux(${
		Component.displayName || Component.name
	})`
	const forwardRef = React.forwardRef((props, ref) => (
		<Wrapper {...props} forwardedRef={ref} />
	))
	return hoistNonReactStatics(forwardRef, Component)
}

function MyInput() {
	return (
		<RenduxPattern.Consumer>
			{(rendux) => (
				<input
					value={
						rendux.state.inputValue ||
						(rendux.state.on ? "on" : "off")
					}
					placeholder="Type 'off' or 'on'"
					onChange={(event) => {
						if (event.target.value === "on") {
							rendux.dispatch({
								type: "toggle",
								value: true,
							})
						} else if (event.target.value === "off") {
							rendux.dispatch({
								type: "toggle",
								value: false,
							})
						}
						rendux.dispatch({
							type: "input_change",
							value: event.target.value,
						})
					}}
					onBlur={(event) => {
						const { value } = event.target
						if (value !== "on" && value !== "off") {
							rendux.dispatch({
								type: "input_change",
								value: rendux.state.on ? "on" : "off",
							})
						}
					}}
				/>
			)}
		</RenduxPattern.Consumer>
	)
}

function MySwitch() {
	return (
		<RenduxPattern.Consumer>
			{(rendux) => (
				<div
					style={{
						marginTop: 20,
						marginBottom: 20,
					}}
				>
					<Switch
						on={rendux.state.on}
						onClick={() => {
							rendux.dispatch({
								type: "toggle",
								value: !rendux.state.on,
							})

							if (rendux.state.inputValue) {
								rendux.dispatch({
									type: "input_change",
									value: !rendux.state.on ? "on" : "off",
								})
							}
						}}
					/>
				</div>
			)}
		</RenduxPattern.Consumer>
	)
}

const StatePrinter = withRendux(function StatePrinter({ rendux }) {
	return (
		<div style={{ textAlign: "left" }}>
			state:
			<pre data-testid="printed-state">
				{JSON.stringify(rendux.state, null, 2)}
			</pre>
		</div>
	)
})

export default function RenduxCmp() {
	return (
		<RenduxPattern
			initialState={{ on: true }}
			reducer={(state, action) => {
				switch (action.type) {
					case "toggle":
						return {
							...state,
							on: action.value,
						}
					case "input_change":
						return {
							...state,
							inputValue: action.value,
						}
					default:
						return state
				}
			}}
		>
			{({ reset }) => (
				<React.Fragment>
					<MyInput />
					<MySwitch />
					<button onClick={reset}>reset</button>
					<StatePrinter />
				</React.Fragment>
			)}
		</RenduxPattern>
	)
}
