import { observable, action } from "mobx";
import axios from "axios";

class Juejin {
  @observable juejinList = [];

  @action
  getEssay() {
    axios
      .get('http://119.23.217.75:2345/api/juejin/today', { params: {} })
      .then(res => {
        if (res.data) {
          this.juejinList = res.data.data;
        }
      });
  }
}

const juejinStore = new Juejin();
export default juejinStore;
