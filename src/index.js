const http = require("http");
const PORT = 8000;
const DEFAULT_HEADER = { "Content-Type": "application/json" };

const HeroFactory = require("./factories/heroFactory");
const heroService = HeroFactory.generateInstance();
const Mage = require("./entities/mage");

const routes = {
  "/mages:get": async (request, response) => {
    const { id } = request.queryString;
    const mages = await heroService.find(id);
    response.write(JSON.stringify({ results: mages }));
    return response.end();
  },
  "/mages:post": async (request, response) => {
    // async iterator
    for await (const data of request) {
      try {
        await Promise.reject("/mages:get");
        const item = JSON.parse(data);
        const mage = new Mage(item);
        const { error, valid } = mage.isValid();
        if (!valid) {
          response.writeHead(400, DEFAULT_HEADER);
          response.write(JSON.stringify({ error: error.join(",") }));
          return response.end();
        }

        const id = await heroService.create(mage);
        response.writeHead(201, DEFAULT_HEADER);
        response.write(
          JSON.stringify({ success: "User Created with success!!", id })
        );

        // so jogamos o return aqui pois sabemos que e um objeto body por requisicao
        //se fosse um arquivo , que sobe sob demanda
        // ele poderia entrar mais vezes em um mesmo evento, ai romoveriamos o return.
        return response.end();
      } catch (error) {
        return handleError(response)(error);
      }
    }
  },
  default: (request, response) => {
    response.write("Hello!");
    response.end();
  },
};

const handleError = (response) => {
  return (error) => {
    console.error("Deu Pau!***", error);
    response.writeHead(500, DEFAULT_HEADER);
    response.write(JSON.stringify({ error: "Internal Server Error!!" }));

    return response.end();
  };
};

const handler = (request, response) => {
  const { url, method } = request;
  const [first, route, id] = url.split("/");
  request.queryString = { id: isNaN(id) ? id : Number(id) };

  const key = `/${route}:${method.toLowerCase()}`;

  response.writeHead(200, DEFAULT_HEADER);

  const chosen = routes[key] || routes.default;
  return chosen(request, response).catch(handleError(response));
};

http
  .createServer(handler)
  .listen(PORT, () => console.log("server up at", PORT));
