const { readFile, writeFile } = require("fs/promises");
class HeroRepository {
  constructor({ file }) {
    this.file = file;
  }
  //mostra os objetos do arquivo data.json
  async _currentFileContent() {
    return JSON.parse(await readFile(this.file));
  }
  async find(itemId) {
    const all = await this._currentFileContent();
    if (!itemId) return all;

    return all.find(({ id }) => itemId === id);
  }

  //cria objetos no data.json
  async create(data) {
    const currentFile = await this._currentFileContent();
    currentFile.push(data);

    await writeFile(this.file, JSON.stringify(currentFile));

    return data.id;
  }
}

module.exports = HeroRepository;

const heroRepository = new HeroRepository({
  file: "./../../database/data.json",
});

//heroRepository
//  .create({ id: 2, name: "Gandalf", age: 102, power: "firework" })
//  .then(console.log)
//  .catch((error) => console.log("error", error));

//heroRepository
//  .find(1)
//  .then(console.log)
//  .catch((error) => console.log("error", error));
