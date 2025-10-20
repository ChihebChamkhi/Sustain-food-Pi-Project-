// Home.jsx
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import About from "../../components/About";
import Menu from "../../components/Menu";
import Review from "../../components/Review";
import DescriptionSection from "../../components/DescriptionSection";
import Banner from "../../components/Banner";
import HowItWorks from "../../components/HowItWorks";
import PageTitle from "../../components/PageTitle";

function Home() {
  const { user, logout } = useContext(AuthContext); // Get user & logout from context
  console.log("Home component user state:", user); // Debugging ... display user state

  return (
    <div>
      <main>
        <PageTitle title="Home" />
        <Banner user={user} /> {/* Pass the user prop to Banner */}
        <DescriptionSection />
        <HowItWorks />
        <Menu />
        <About />
        <Review />
      </main>
    </div>
  );
}

export default Home;