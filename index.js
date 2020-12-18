const Joi = require("joi");
const express = require("express");
const app = express();
// joi.validate() no longer a fxn since v.16
app.use(express.json());

const courses = [
  { id: 1, name: "math" },
  { id: 2, name: "spanish" },
];
app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

// app.post("/api/courses", (req, res) => {
//   const course = {
//     id: courses.length + 1,
//     name: req.body.name,
//   };
//   courses.push(course);
//   res.send(course);
// });

// app.post("/api/courses", (req, res) => {
//   const schema = Joi.object({
//     name: Joi.string().min(3).required(),
//   });
//   const validation = schema.validate(req.body);
//   res.send(validation);

//   if (!req.body.name || req.body.name.length < 3) {
//     res
//       .status(400)
//       .send("Name is required and should be minimum of 3 characters");
//     return;
//   }
//   const course = {
//     id: courses.length + 1,
//     name: req.body.name,
//   };
//   courses.push(course);
//   res.send(course);
// });

app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body); //result.error
  if (error) return res.status(400).send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found");

  const { error } = validateCourse(req.body); //result.error
  if (error) return res.status(400).send(error.details[0].message);

  course.name = req.body.name;
  res.send(course);
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(course);
}

app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found");

  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
