const express = require("express");
const chalk = require("chalk");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const {
  addAppointment,
  getAppointment,
  deleteAppointment,
} = require("./appointment.controller");
const { addUser, loginUser } = require("./users.controller");
const auth = require("./middlewares/auth");

const port = 3005;
const app = express();

app.set("view engine", "ejs");
app.set("views", "pages");

app.use(express.static(path.resolve(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/login", async (req, res) => {
  res.render("login", {
    title: "Home Doctor",
    created: false,
    error: undefined,
  });
});

app.post("/login", async (req, res) => {
  try {
    const token = await loginUser(req.body.email, req.body.password);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/appointmentPage");
  } catch (e) {
    res.render("login", {
      title: "Home Doctor",
      created: false,
      error: e.message,
    });
  }
});

app.get("/appointmentPage", async (req, res) => {
  res.render("appointmentPage", {
    title: "Home Doctor",
    created: false,
    error: undefined,
  });
});

app.get("/requestsToDoctor", async (req, res) => {
  res.render("requestsToDoctor", {
    title: "Home Doctor",
    appointments: await getAppointment(),
    created: false,
    error: undefined,
  });
});

app.get("/register", async (req, res) => {
  res.render("register", {
    title: "Home Doctor",
    created: false,
    error: undefined,
  });
});

app.post("/register", async (req, res) => {
  try {
    await addUser(req.body.email, req.body.password);
    res.redirect("/login");
  } catch (e) {
    if (e.code === 11000) {
      res.render("register", {
        title: "Home Doctor",
        error: `User with email address: '${req.body.email}' already exists!`,
      });
      return;
    }

    res.render("register", {
      title: "Home Doctor",
      error: e.message,
    });
  }
});

app.get("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true });
  res.redirect("/login");
});

app.use(auth);

app.get("/appointment/:id", async (req, res) => {
  try {
    res.render("appointmentPage", {
      title: "Home Doctor",
      created: false,
      error: undefined,
      appointment: await getAppointment(req.params.id),
    });
  } catch (error) {
    console.log(error);
    res.render("appointmentPage", {
      title: "Home Doctor",
      created: false,
      error: error.message,
    });
  }
});

app.post("/appointment", async (req, res) => {
  try {
    const { date, name, phone, symptom } = req.body;
    await addAppointment(date, name, phone, symptom);
    res.redirect("/requestsToDoctor");
  } catch (error) {
    console.log(error);
    res.render("appointmentPage", {
      title: "Home Doctor",
      created: false,
      error: error.message,
    });
  }
});

app.delete("/appointment/:id", async (req, res) => {
  try {
    await deleteAppointment(req.params.id);
    res.render("requestsToDoctor", {
      title: "Home Doctor",
      appointments: await getAppointment(),
      created: false,
      error: undefined,
    });
  } catch (error) {
    console.log(error);
  }
});

mongoose
  .connect(
    "mongodb+srv://Alex:Holyhelper199125@cluster0.okdkyf0.mongodb.net/Private_clinic?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(chalk.green(`Server has been started on port ${port}...`));
    });
  });
