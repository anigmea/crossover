import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faUser } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";

const NavbarWrapper = styled.div`
  width: 94%;
  max-height: 200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3%;
  flex-direction: row;
  background-color: ${(props) => (props.isHome ? "transparent" : "#f4f4f4")};
  color: ${(props) => (props.isHome ? "white" : "black")};
  box-shadow: ${(props) => (props.isHome ? "none" : "0px 2px 5px rgba(0, 0, 0, 0.1)")};
  position: ${(props) => (props.isHome ? "absolute" : "relative")};
  z-index: 10;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    justify-content: left;
    padding: 2%;
  }
`;

const LOGO = styled.a`
  color: ${(props) => (props.isHome ? "white" : "black")};
  font-size: 40px;
  font-family: "Yeezy", sans-serif;
  text-decoration: none;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 30px;
    margin-bottom: 0px;
  }
`;

const LINK_DIV = styled.div`
  width: 15%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 15px;

  @media (max-width: 768px) {
    width: 30%;
    justify-content: space-around;
    margin-bottom: 15px;
  }
`;

const LINK = styled.a`
  font-family: "Yeezy", sans-serif;
  padding-left: 5%;
  font-size: 18px;
  text-decoration: none;
  color: ${(props) => (props.isHome ? "white" : "black")};

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    padding-left: 0;
  }
`;

const SIGNIN_DIV = styled.div`
  width: 10%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: left;
  padding-top: 15px;

  @media (max-width: 768px) {
    width: 20%;
    grid-template-columns: 1fr 1fr;
    justify-content: center;
  }
`;

const IconWrapper = styled.div`
  color: ${(props) => (props.isHome ? "white" : "black")};
  font-size: 20px;

  a {
    color: inherit; /* Ensures the link inherits the color from the IconWrapper */
    text-decoration: none; /* Removes the default underline */
  }

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "/#/Home";
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if "isloggedin" is present in localStorage
    const loggedInStatus = sessionStorage.getItem("isloggedin");
    setIsLoggedIn(loggedInStatus === "1");
  }, []);

  return (
    <NavbarWrapper isHome={isHome}>
      <LINK_DIV>
        <LINK href="#/Shop" isHome={isHome}>
          Shop
        </LINK>
        <LINK href="#/contact" isHome={isHome}>
          Contact
        </LINK>
      </LINK_DIV>
      <LOGO href="#" isHome={isHome}>
        CROSSOVER
      </LOGO>
      <SIGNIN_DIV>
        <IconWrapper isHome={isHome}>
          <a href="/#/Cart">
            <FontAwesomeIcon icon={faCartShopping} />
          </a>
        </IconWrapper>
        <IconWrapper isHome={isHome}>
          <a href={isLoggedIn ? "/#/Account" : "/#/SignUp"} style={{ textDecoration: "none" }}>
            <FontAwesomeIcon icon={faUser} />
          </a>
        </IconWrapper>
      </SIGNIN_DIV>
    </NavbarWrapper>
  );
};

export default Navbar;
