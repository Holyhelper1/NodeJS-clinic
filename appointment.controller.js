const chalk = require("chalk");
const applicationForm = require("./models/applicationForm");

async function addAppointment(date, name, phone, symptom) {
  const newAppointment = new applicationForm({
    creation_date: new Date().toLocaleDateString(),
    name,
    phone,
    symptom,
  });

  await newAppointment.save();

  console.log(chalk.bgGreen("Appointment was added!"));
}

async function deleteAppointment(id) {
  console.log(chalk.bgRed(`Appointment with id: ${id} was deleted!`));
  return await applicationForm.deleteOne({ _id: id });
}

async function getAppointment(id) {
  const appointment = await applicationForm.find(id);

  return appointment;
}

module.exports = {
  addAppointment,
  getAppointment,
  deleteAppointment,
};
