const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Please provide your MongoDb password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.ft0ter3.mongodb.net/personApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length < 5) {
  console.log("Phonebook: \n");
  Person.find({})
    .then((persons) => {
      if (persons.length > 0) {
        persons.forEach((person) => {
          console.log(`${person.name} ${person.number}`);
        });
      } else {
        console.log("No persons found in the phonebook.");
      }
      mongoose.connection.close();
    })
    .catch((err) => {
      console.error("Error fetching persons:", err);
      mongoose.connection.close();
    });
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((result) => {
    console.log(
      `Added ${result.name} to the Phonebook with the number: ${result.number}`
    );
    mongoose.connection.close();
  });
}
