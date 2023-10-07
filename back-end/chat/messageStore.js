/*abstract*/ class MessageStore {
  saveMessage(message) { }
  findMessagesForUser(userID) { }
}

class MemoryMessageStore extends MessageStore {
  constructor(pool) {
    super();
    //this.messages = [];
    this.postgre = pool;
  }

  async saveMessage({ name, content, photoURL, from, to }) {
    //this.messages.push(message);
    await this.postgre.query("INSERT INTO messages (name, content, photo, \"from\", \"to\") VALUES ($1, $2, $3, $4, $5)", [name, content, photoURL, from, to]);
  }

  async findMessagesForUser(userID) {
    // return this.messages.filter(
    //   ({from, to}) => from === userID || to === userID
    // )
    const results = await this.postgre.query('select * from messages m where m.from = $1 or m.to =$1', [userID]);
    return results.rows;
  }
}

module.exports = {
  MemoryMessageStore
}