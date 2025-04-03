export default function PathParameters(app) {
    app.get("/Lab5/add/:a/:b", (req, res) => {
      const { a, b } = req.params;
      const sum = parseInt(a) + parseInt(b);
      res.send(sum.toString());
    });
    app.get("/Lab5/subtract/:a/:b", (req, res) => {
      const { a, b } = req.params;
      const sum = parseInt(a) - parseInt(b);
      res.send(sum.toString());
    });
    app.get("/Lab5/multiply/:a/:b", (req, res) => {
      const { a, b } = req.params;
      const product = parseInt(a) * parseInt(b);
      res.send(product.toString());
    });
    app.get("/Lab5/divide/:a/:b", (req, res) => {
      const { a, b } = req.params;
      const quotient = parseInt(a) / parseInt(b);
      res.send(quotient.toString());
    });
  };
  