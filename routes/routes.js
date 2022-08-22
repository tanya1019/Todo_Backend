const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Todo = require("../models/Todo");

function routes(app) {
  // health check api
  app.get("/", (req, res) => {
    res.send("Hello Tanya! First backend server");
  });

  //sign up api

  app.post("/signup", (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    });

    if (
      req.body.email === "" ||
      req.body.password === "" ||
      req.body.name === ""
    ) {
      res.status(500).json({
        error: "Feilds cannot be empty",
      });
    } else {
      newUser.save((err) => {
        if (err) {
          return res.status(400).json({
            title: "Error",
            error: "Email already in use",
          });
        }
        return res.status(200).json({
          title: "User Registered Successfully",
        });
      });
    }
  });

  // login api

  app.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err)
        return res.status(500).json({
          title: "server error",
        });
      if (!user) {
        return res.status(400).json({
          title: "user not found",
          error: "invalid username or password",
        });
      }
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).json({
          title: "login failed",
          error: "invalid username or password",
        });
      }

      //authentication is done

      let token = jwt.sign({ userId: user._id }, "secretkey");
      return res.status(200).json({
        title: "login successful",
        token: token,
        user: user,
      });
    });
  });

  //add todo api
  app.post("/addTodo", (req, res) => {
    const newTodo = new Todo({
      todo: req.body.todo,
      created_at: req.body.created_at,
      userId: req.body.userId,
      completed: false,
      priority: req.body.priority,
      deadline: req.body.deadline,
    });
    newTodo.save((err, result) => {
      if (err) {
        return res.status(400).json({
          title: "Error",
          error: "Todo not created",
        });
      }
      return res.status(200).json({
        title: "Task registered",
        todo: result,
      });
    });
  });

  //get todi tasks
  app.get("/todo/task", (req, res) => {
    const userId = req.query.userId;
    Todo.find({ userId: userId }, (err, task) => {
      if (err) {
        res.status(500).json({
          title: "Error",
          error: "Task not found",
        });
      } else {
        res.status(200).json({
          title: "Task found",
          todos: task,
        });
      }
    });
  });

  // completed todo
  app.post("/completedtodo", (req, res) => {
    let TodoId = req.body.TodoId;
    Todo.findByIdAndUpdate(TodoId, { completed: true }, (err, completed) => {
      if (err) {
        res.status(500).json({
          title: "error",
        });
      } else {
        res.status(200).json({
          title: "task completed successfully",
          todo: completed,
        });
      }
    });
  });

  //delete todo
  app.post("/deleletodo", (req, res) => {
    let TodoId = req.body.TodoId;
    Todo.findByIdAndDelete(TodoId, (err, deleted) => {
      if (err) {
        res.status(500).json({
          title: "Error",
        });
      } else {
        res.status(200).json({
          title: "Task deleted successfully",
          todo: deleted,
        });
      }
    });
  });

  // undo task
  app.post("/undotodo", (req, res) => {
    let TodoId = req.body.TodoId;
    Todo.findByIdAndUpdate(TodoId, { completed: false }, (err, todo) => {
      if (err) {
        res.status(500).json({
          title: "error",
        });
      } else {
        res.status(200).json({
          title: "Task successfully updated",
          todo: todo,
        });
      }
    });
  });

  //edittodo

  app.post("/edittodo", (req, res) => {
    let TodoId = req.body.TodoId;
    Todo.findByIdAndUpdate(
      TodoId,
      {
        todo: req.body.todo,
        created_at: req.body.created_at,
        priority: req.body.priority,
        deadline: req.body.deadline,
      },
      (err, edit) => {
        if (err) {
          res.status(500).json({
            title: "error",
          });
        } else {
          res.status(200).json({
            title: "Task successfully updated",
            todo: edit,
          });
        }
      }
    );
  });
}

module.exports = routes;
