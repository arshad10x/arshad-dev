import useLenis from "./lib/useLenis";
import Nav from "./components/Nav";
import CustomCursor from "./components/CustomCursor";
import AmbientInk from "./components/AmbientInk";
// import IntroSplash from "./components/IntroSplash";
import Hero from "./components/Hero";
import Profile from "./components/Profile";
import Tools from "./components/Tools";
import Works from "./components/Works";
import Journey from "./components/Journey";
import Letter from "./components/Letter";
import "./App.css";

export default function App() {
  useLenis();
  // const [introDone, setIntroDone] = useState(false);

  return (
    <>
      {/* <IntroSplash onDone={() => setIntroDone(true)} /> */}

      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <CustomCursor />
      <AmbientInk />
      <div className="app-shell">
        <Nav />
        <main id="main">
          <Hero />
          <Profile />
          <Tools />
          <Works />
          <Journey />
          <Letter />
        </main>
      </div>
    </>
  );
}