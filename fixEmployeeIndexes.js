const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/payrollDB")
  .then(async () => {
    console.log("MongoDB Connected");

    const indexes = await mongoose.connection.db
      .collection("employees")
      .indexes();

    console.log(indexes);

    await mongoose.connection.db
      .collection("employees")
      .dropIndexes();

    console.log("Employee indexes fixed successfully");

    process.exit();
  })
  .catch((err) => {
    console.log(err);
    process.exit();
  });