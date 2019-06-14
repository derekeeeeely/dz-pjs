import { observable, action } from 'mobx'
import { fetchJSONByGet } from 'utils/ajax'

class SearchPage {
  @observable data = []

  @action async getData(url, params) {
    const result = await fetchJSONByGet(url, params)
    this.data = result
  }
}

const searchPageStore = new SearchPage()

export default searchPageStore
