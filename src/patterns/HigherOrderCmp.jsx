import React from "react"
import hoistNonReactStatics from "hoist-non-react-statics"
import Switch from "components/Switch"

/* 
	Higher Order Component is a concept to share code/state
*/

const HOCPatternCtx = React.createContext({
	on: false,
	toggle: () => {},
	reset: () => {},
	getTogglerProps: () => {},
})

const callAll =
	(...fns) =>
	(...args) =>
		fns.forEach((fn) => fn && fn(...args))

class HOCPattern extends React.Component {
	static defaultProps = {
		initialOn: false,
		onReset: () => {},
		onToggle: () => {},
		onStateChange: () => {},
		stateReducer: (state, changes) => changes,
	}

	static stateChangeTypes = {
		reset: "__toggle_reset__",
		toggle: "__toggle_toggle__",
	}

	static Consumer = HOCPatternCtx.Consumer

	reset = () =>
		this.internalSetState(
			{
				...this.initialState,
				type: HOCPattern.stateChangeTypes.reset,
			},
			() => this.props.onReset(this.getState().on)
		)

	toggle = ({ type = HOCPattern.stateChangeTypes.toggle } = {}) =>
		this.internalSetState(
			({ on }) => ({ type, on: !on }),
			() => this.props.onToggle(this.getState().on)
		)
	getTogglerProps = ({ onClick, ...props } = {}) => ({
		onClick: callAll(onClick, () => this.toggle()),
		"aria-expanded": this.getState().on,
		...props,
	})

	initialState = {
		on: this.props.initialOn,
		toggle: this.toggle,
		reset: this.reset,
		getTogglerProps: this.getTogglerProps,
	}

	state = this.initialState
	isControlled(prop) {
		return this.props[prop] !== undefined
	}

	getState(state = this.state) {
		return Object.entries(state).reduce(
			(combinedState, [key, value]) => {
				if (this.isControlled(key)) {
					combinedState[key] = this.props[key]
				} else {
					combinedState[key] = value
				}
				return combinedState
			},
			{}
		)
	}

	internalSetState(changes, callback = () => {}) {
		let allChanges
		this.setState(
			(state) => {
				const combinedState = this.getState(state)
				const changesObject =
					typeof changes === "function"
						? changes(combinedState)
						: changes

				allChanges =
					this.props.stateReducer(combinedState, changesObject) || {}

				const { type: ignoredType, ...onlyChanges } = allChanges

				const nonControlledChanges = Object.keys(
					combinedState
				).reduce((newChanges, stateKey) => {
					if (!this.isControlled(stateKey)) {
						newChanges[stateKey] = onlyChanges.hasOwnProperty(
							stateKey
						)
							? onlyChanges[stateKey]
							: combinedState[stateKey]
					}
					return newChanges
				}, {})

				return Object.keys(nonControlledChanges || {}).length
					? nonControlledChanges
					: null
			},
			() => {
				this.props.onStateChange(allChanges, this.state)
				callback()
			}
		)
	}

	render() {
		const _UI =
			typeof this.props.children === "function"
				? this.props.children(this.state)
				: this.props.children

		return (
			<HOCPatternCtx.Provider value={this.state}>
				{_UI}
			</HOCPatternCtx.Provider>
		)
	}
}

function withToggle(Cmp) {
	const Wrapper = React.forwardRef((props, ref) => {
		return (
			<HOCPattern.Consumer>
				{(toggleUtils) => (
					<Cmp ref={ref} {...props} toggle={toggleUtils} />
				)}
			</HOCPattern.Consumer>
		)
	})

	Wrapper.displayName = `withToggle(${Cmp.displayName || Cmp.name})`

	hoistNonReactStatics(Wrapper, Cmp)

	return Wrapper
}

export class Debug extends React.Component {
	childInstance = React.createRef()
	render() {
		return React.cloneElement(this.props.children, {
			ref: this.childInstance,
		})
	}
}

export default function HOCCmp() {
	return (
		<HOCPattern>
			<div className="friends">
				<Header />
				<Post />
			</div>
		</HOCPattern>
	)
}

function Nav() {
	return (
		<HOCPattern.Consumer>
			{(toggle) => (
				<nav>
					<ul>
						<li>
							<a href="index.html">{toggle.on ? "🏡" : "Home"}</a>
						</li>
						<li>
							<a href="/about/">{toggle.on ? "❓" : "About"}</a>
						</li>
						<li>
							<a href="/blog/">{toggle.on ? "📖" : "Blog"}</a>
						</li>
					</ul>
				</nav>
			)}
		</HOCPattern.Consumer>
	)
}

function NavSwitch() {
	return (
		<div className="nav-switch">
			<div>
				<HOCPattern.Consumer>
					{(toggle) => (toggle.on ? "🦄" : "Enable Emoji")}
				</HOCPattern.Consumer>
			</div>
			<HOCPattern.Consumer>
				{(toggle) => (
					<Switch
						{...toggle.getTogglerProps({
							on: toggle.on,
						})}
					/>
				)}
			</HOCPattern.Consumer>
		</div>
	)
}

function Header() {
	return (
		<div className="header">
			<Nav />
			<NavSwitch />
		</div>
	)
}

const Subtitle = withToggle(
	class extends React.Component {
		static displayName = "Subtitle"
		static emoji = "👩‍🏫 👉 🕶"
		static text = "Teachers are awesome"
		instanceProperty = true
		render() {
			return (
				<span>
					{this.props.toggle.on ? Subtitle.emoji : Subtitle.text}
				</span>
			)
		}
	}
)

function Title() {
	return (
		<div>
			<h1>
				<HOCPattern.Consumer>
					{(toggle) => `Who is ${toggle.on ? "🕶❓" : "awesome?"}`}
				</HOCPattern.Consumer>
			</h1>

			<Debug title="subtitle">
				<Subtitle ref={(i) => (this.i = i)} />
			</Debug>
		</div>
	)
}

function Article() {
	return (
		<div>
			<HOCPattern.Consumer>
				{(toggle) =>
					[
						"Once, I was in",
						toggle.on ? "🏫‍" : "school",
						"when I",
						toggle.on ? "🤔" : "realized",
						"something...",
					].join(" ")
				}
			</HOCPattern.Consumer>
			<hr />
			<HOCPattern.Consumer>
				{(toggle) =>
					[
						"Without",
						toggle.on ? "👩‍🏫" : "teachers",
						`I wouldn't know anything so`,
						toggle.on ? "🙏" : "thanks",
						toggle.on ? "👩‍🏫❗️" : "teachers!",
					].join(" ")
				}
			</HOCPattern.Consumer>
		</div>
	)
}

function Post() {
	return (
		<div>
			<Title />
			<Article />
		</div>
	)
}
