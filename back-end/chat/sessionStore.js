/* abstract */ class SessionStore {
  findSession(id) {}
  saveSession(id, session) {}
  findAllSessions() {}
}

const mapSession = ([userID, email, name, photoURL, connected]) =>
  userID ? { userID, email, name, photoURL, connected } : undefined;

class MemorySessionStore extends SessionStore {
  constructor(redis) {
    super();
    this.redisClient = redis;
  }

  findSession(id) {
    return this.redisClient
      .hmget(`session:${id}`, "userID", "email", "name", "photoURL", "connected")
      .then(mapSession);
  }

  saveSession(id, { userID, email, name, photoURL, connected }) {
    this.redisClient
      .multi()
      .hset(
        `session:${id}`,
        "userID",
        userID,
        "email",
        email,
        "name",
        name,
        "photoURL",
        photoURL,
        "connected",
        connected
      )
      .expire(`session:${id}`, 24*60*60)
      .exec();
  }

  async findAllSessions() {
    const keys = new Set();
    let nextIndex = 0;
    do {
      const [nextIndexAsStr, results] = await this.redisClient.scan(
        nextIndex,
        "MATCH",
        "session:*",
        "COUNT",
        "100"
      );
      nextIndex = parseInt(nextIndexAsStr, 10);
      results.forEach((s) => keys.add(s));
    } while (nextIndex !== 0);
    const commands = [];
    keys.forEach((key) => {
      commands.push(["hmget", key, "userID", "email", "name", "photoURL", "connected"]);
    });
    return this.redisClient
      .multi(commands)
      .exec()
      .then((results) => {
        return results
          .map(([err, session]) => (err ? undefined : mapSession(session)))
          .filter((v) => !!v);
      });
  }
}

module.exports = {
  MemorySessionStore
};