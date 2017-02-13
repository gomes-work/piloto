var eb = vertx.eventBus();

vertx.createHttpServer().requestHandler(function (req) {
  
  eb.send("ping-address", "ping!", function (reply, reply_err) {
      if (reply_err == null) {
        req.response().putHeader("content-type", "text/html").end("<html><body><h1>Received reply " + reply.body() + "</h1></body></html>");
      } else {
        req.response().putHeader("content-type", "text/html").end("<html><body><h1>No reply</h1></body></html>");
      }
    });

}).listen(8080);
