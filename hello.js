export default function Hello(app) {
  app.get("/hello", (req, res) => {
    res.send("<h1>hello world 456<h1>"); // "hello world"
  });
  app.get("/", (req, res) => {
    res.send("Welcome to Full Stack Development!");
  });
}
