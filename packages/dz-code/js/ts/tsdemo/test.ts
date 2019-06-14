let pwd = 'pwd';

class Test {
  private _name: string;
  static hh: string = 'hello';
  get name(): string {
    return this._name
  }
  set name(newName: string) {
    if (pwd === 'pwd') {
      this._name = newName;
    } else {
      console.log('u can')
    }
  }
}
