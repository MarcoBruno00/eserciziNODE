import { EventEmitter } from "events";

function createNewsFeed() {
  const emitter = new EventEmitter();

  const newsEventListener = (data) => {
    console.log(`News Event: ${data}`);
  };

  const breakingNewsListener = (data) => {
    console.log(`Breaking News: ${data}`);
  };

  const errorListener = (error) => {
    console.error(`Error: ${error.message}`);
    // Puoi anche gestire ulteriori azioni in caso di errore
  };

  emitter.on("newsEvent", newsEventListener);
  emitter.on("breakingNews", breakingNewsListener);
  emitter.on("error", errorListener);

  setInterval(() => {
    emitter.emit("newsEvent", "News: A thing happened in a place.");
  }, 1000);

  setInterval(() => {
    emitter.emit("breakingNews", "Breaking news! A BIG thing happened.");
  }, 4000);

  setTimeout(() => {
    emitter.off("newsEvent", newsEventListener);
    emitter.off("breakingNews", breakingNewsListener);
    emitter.off("error", errorListener);

    emitter.emit("error", new Error("News feed connection error"));
  }, 5000);

  return emitter;
}

const newsFeed = createNewsFeed();
