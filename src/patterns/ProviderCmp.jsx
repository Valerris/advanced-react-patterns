import React from "react"
import Switch from "components/Switch"

const ProviderPatternCtx = React.createContext({
	on: false,
	toggle: () => {},
	reset: () => {},
	getTogglerProps: () => {},
})

const callAll =
	(...fns) =>
	(...args) =>
		fns.forEach((fn) => fn && fn(...args))

class ProviderPattern extends React.Component {
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

	static Consumer = ProviderPatternCtx.Consumer

	reset = () =>
		this.internalSetState(
			{
				...this.initialState,
				type: ProviderPattern.stateChangeTypes.reset,
			},
			() => this.props.onReset(this.getState().on)
		)

	toggle = ({
		type = ProviderPattern.stateChangeTypes.toggle,
	} = {}) =>
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
			<ProviderPatternCtx.Provider value={this.state}>
				{_UI}
			</ProviderPatternCtx.Provider>
		)
	}
}

export default function ProviderCmp() {
	return (
		<ProviderPattern>
			<div className="friends">
				<Header />
				<Post />
			</div>
		</ProviderPattern>
	)
}

function Nav() {
	return (
		<ProviderPattern.Consumer>
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
		</ProviderPattern.Consumer>
	)
}

function NavSwitch() {
	return (
		<div className="nav-switch">
			<div>
				<ProviderPattern.Consumer>
					{(toggle) => (toggle.on ? "🦄" : "Enable Emoji")}
				</ProviderPattern.Consumer>
			</div>
			<ProviderPattern.Consumer>
				{(toggle) => (
					<Switch
						{...toggle.getTogglerProps({
							on: toggle.on,
						})}
					/>
				)}
			</ProviderPattern.Consumer>
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

function Subtitle() {
	return (
		<ProviderPattern.Consumer>
			{(toggle) => (toggle.on ? "👩‍🏫 👉 🕶" : "Teachers are awesome")}
		</ProviderPattern.Consumer>
	)
}

function Title() {
	return (
		<div>
			<h1>
				<ProviderPattern.Consumer>
					{(toggle) => `Who is ${toggle.on ? "🕶❓" : "awesome?"}`}
				</ProviderPattern.Consumer>
			</h1>
			<Subtitle />
		</div>
	)
}

function Article() {
	return (
		<div>
			<ProviderPattern.Consumer>
				{(toggle) =>
					[
						"Once, I was in",
						toggle.on ? "🏫‍" : "school",
						"when I",
						toggle.on ? "🤔" : "realized",
						"something...",
					].join(" ")
				}
			</ProviderPattern.Consumer>
			<hr />
			<ProviderPattern.Consumer>
				{(toggle) =>
					[
						"Without",
						toggle.on ? "👩‍🏫" : "teachers",
						`I wouldn't know anything so`,
						toggle.on ? "🙏" : "thanks",
						toggle.on ? "👩‍🏫❗️" : "teachers!",
					].join(" ")
				}
			</ProviderPattern.Consumer>
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
