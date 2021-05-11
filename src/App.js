import "./App.css"
import Switch from "components/Switch"
import Toggle from "patterns/ToggleCmp"
import BasicCompoundCmp from "patterns/BasicCompoundCmp"
import FlexibleCompoundCmp from "patterns/FlexibleCompoundCmp"
import RenderPropCmp from "patterns/RenderPropCmp"
import PropsCollectionsCmp from "patterns/PropsCollectionsCmp"
import PropsGettersCmp from "patterns/PropsGettersCmp"
import StateInitializerCmp from "patterns/StateInitializerCmp"
import StateReducerCmp from "patterns/StateReducerCmp"
import StateReducerWithChangeTypesCmp from "patterns/StateReducerWithChangeTypesCmp"
import ControlPropsPrimerCmp from "patterns/ControlPropsPrimerCmp"
import ControlPropsCmp from "patterns/ControlPropsCmp"
import ProviderCmp from "patterns/ProviderCmp"
import HigherOrderCmp from "patterns/HigherOrderCmp"
import RenduxCmp from "patterns/RenduxCmp"

function App() {
	const toggle = (...args) => console.log("onToggle", ...args)
	const reset = (...args) => console.log("onReset", ...args)

	return (
		<div className="App">
			<h3>Toggle Cmp</h3>
			<p>
				<Toggle onToggle={toggle} />
			</p>

			<h3>BasicCompoundCmp</h3>
			<p>
				<BasicCompoundCmp onToggle={(on) => console.log(on)}>
					<BasicCompoundCmp.TextOn>Is ON</BasicCompoundCmp.TextOn>
					<BasicCompoundCmp.TextOff>Is OFF</BasicCompoundCmp.TextOff>
					<BasicCompoundCmp.Button />
				</BasicCompoundCmp>
			</p>

			<h3>FlexibleCompoundCmp</h3>
			<p>
				<FlexibleCompoundCmp onToggle={toggle}>
					<div>
						<FlexibleCompoundCmp.TextOn>
							Is ON
						</FlexibleCompoundCmp.TextOn>
						<FlexibleCompoundCmp.TextOff>
							Is OFF
						</FlexibleCompoundCmp.TextOff>
						<div>
							<FlexibleCompoundCmp.Button />
						</div>
					</div>
				</FlexibleCompoundCmp>
			</p>

			<h3>RenderPropCmp</h3>
			<p>
				<RenderPropCmp onToggle={toggle}>
					{({ on, toggle }) => (
						<div>
							{on ? "Is ON" : "Is OFF"}
							<Switch on={on} onClick={toggle} />
							<button aria-label="custom-button" onClick={toggle}>
								{on ? "Is ON" : "Is OFF"}
							</button>
						</div>
					)}
				</RenderPropCmp>
			</p>

			<h3>PropsCollectionsCmp</h3>
			<p>
				<PropsCollectionsCmp onToggle={toggle}>
					{({ on, togglerProps }) => (
						<div>
							{on ? "Is ON" : "Is OFF"}
							<Switch on={on} {...togglerProps} />
							<button aria-label="custom-button" {...togglerProps}>
								{on ? "Is ON" : "Is OFF"}
							</button>
						</div>
					)}
				</PropsCollectionsCmp>
			</p>

			<h3>PropsGettersCmp</h3>
			<p>
				<PropsGettersCmp onToggle={toggle}>
					{({ on, getTogglerProps }) => (
						<div>
							{on ? "Is ON" : "Is OFF"}
							<Switch
								on={on}
								{...getTogglerProps({
									onClick: () => console.log("clicked"),
								})}
							/>
							<button
								aria-label="custom-button"
								{...getTogglerProps({
									onClick: () => console.log("clicked"),
								})}
							>
								{on ? "Is ON" : "Is OFF"}
							</button>
						</div>
					)}
				</PropsGettersCmp>
			</p>

			<h3>StateInitializerCmp</h3>
			<p>
				<StateInitializerCmp
					initialOn={true}
					onToggle={toggle}
					onReset={reset}
				>
					{({ getTogglerProps, on, reset }) => (
						<div>
							<Switch {...getTogglerProps({ on })} />
							<button onClick={() => reset()}>Reset</button>
						</div>
					)}
				</StateInitializerCmp>
			</p>

			<h3>StateReducerCmp</h3>
			<p>
				<StateReducerCmp
					initialTimesClicked={0}
					onToggle={toggle}
					onReset={reset}
				/>
			</p>

			<h3>StateReducerWithChangeTypesCmp</h3>
			<p>
				<StateReducerWithChangeTypesCmp
					initialTimesClicked={0}
					onToggle={toggle}
					onReset={reset}
				/>
			</p>

			<h3>ControlPropsPrimerCmp</h3>
			<p>
				<ControlPropsPrimerCmp />
			</p>

			<h3>ControlPropsCmp</h3>
			<p>
				<ControlPropsCmp
					initialTimesClicked={0}
					onToggle={toggle}
					onReset={reset}
				/>
			</p>

			<h3>ProviderCmp</h3>
			<p>
				<ProviderCmp />
			</p>

			<p>HigherOrderCmp</p>
			<p>
				<HigherOrderCmp />
			</p>

			<p>RenduxCmp</p>
			<p>
				<RenduxCmp />
			</p>
		</div>
	)
}

export default App
