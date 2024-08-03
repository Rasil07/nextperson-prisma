"use client";

import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Layout from "../app/layout";
import PersonTable from "./components/PersonTable";
import PersonDialog from "./components/PersonDialog";
import SnackbarAlert from "./components/SnackbarAlert";
import {
  createPerson,
  Person,
  updatePerson,
  deletePerson,
} from "../app/lib/person";

//these are required for the AppBar
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

//import my custom Footer that will go at the bottom of the page
import Footer from "./components/CFooter";

const HomePage: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [open, setOpen] = useState(false);
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await fetch("/api/people");
        if (response.ok) {
          const data = await response.json();
          setPeople(data);
        } else {
          console.log("Error fetching people data.");
        }
      } catch (error) {
        console.log("Error fetching people data:", error);
      }
    };

    fetchPeople();
  }, []);

  const handleOpen = (person: Person | null) => {
    setCurrentPerson(person);
    setEditMode(!!person);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentPerson(null);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deletePerson(String(id));

      if (response) {
        setPeople((prevPeople) =>
          prevPeople.filter((person) => person.id !== id)
        );
        setSnackbarMessage("Record deleted successfully!");
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage("Error deleting the record.");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      console.error("Error deleting the person:", error);
      setSnackbarMessage("Error deleting the record.");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      if (editMode && currentPerson) {
        formData.append("id", currentPerson.id.toString());
        const updatedPerson = await updatePerson(formData);
        setPeople((prevPeople) =>
          prevPeople.map((person) =>
            person.id === updatedPerson.id ? updatedPerson : person
          )
        );
      } else {
        const newPerson = await createPerson(formData);
        setPeople((prevPeople) => [...prevPeople, newPerson]);
      }

      setSnackbarMessage("Record saved successfully!");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Error saving the person:", error);
      setSnackbarMessage("Error saving the record.");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
    handleClose();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Layout>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            People
          </Typography>
        </Toolbar>
      </AppBar>
      {/* Add spacing below the AppBar */}
      <div style={{ marginTop: "50px" }}></div>

      <Container component="main" style={{ flex: 1, marginTop: "64px" }}>
        <Button variant="contained" onClick={() => handleOpen(null)}>
          Add New Person
        </Button>
        <PersonTable
          people={people}
          handleOpen={handleOpen}
          handleDelete={handleDelete}
        />
        <PersonDialog
          open={open}
          handleClose={handleClose}
          currentPerson={currentPerson}
          setCurrentPerson={setCurrentPerson}
          handleSubmit={handleSubmit}
        />
        <SnackbarAlert
          snackbarOpen={snackbarOpen}
          handleSnackbarClose={handleSnackbarClose}
          snackbarMessage={snackbarMessage}
          snackbarSeverity={snackbarSeverity}
        />
      </Container>
      <Footer />
    </Layout>
  );
};

export default HomePage;
