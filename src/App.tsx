import React, { useState } from "react";
import './app.scss';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Table from "./components/Table";
import Input from "./components/Input";
import RadioButton from "./components/RadioButton";

const App: React.FC = () => {
  const [name, setName] = useState<string>('Janko')
  const [lastName, setLastName] = useState<string>('Hraško')
  return (
    <>
      <Navbar />
      <div className="govuk-width-container" id="main-content">
        <main className="govuk-main-wrapper govuk-main-wrapper--auto-spacing">
          <Table />
          <div>
            <form action="/" method="post">
              <Input
                name="name"
                value={name}
                label="Meno použivateľa"
                onChange={(value) => setName(value)}
              />
              <Input
                name="lastName"
                value={lastName}
                label="Priezvisko použivateľa"
                onChange={(value) => setLastName(value)}
              />
              <RadioButton
                name="account"
                value="Hraško"
                label="Máte už vytvorený osobný účet?"
              />
              <div style={{ textAlign: "center" }}>
                <button className="govuk-button">Odoslať formulár</button>
              </div>
            </form>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default App;
