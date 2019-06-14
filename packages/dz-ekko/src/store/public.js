import { observable, action } from 'mobx'

class Public {
  @observable tabList = sessionStorage.getItem('tabState') ? JSON.parse(sessionStorage.getItem('tabState')).list : []
  @observable activeTab = sessionStorage.getItem('tabState') ? JSON.parse(sessionStorage.getItem('tabState')).activeTab : ''
  @observable loading = false

  @action pushTab(data) {
    this.activeTab = data.url
    if (!this.tabList.find(tab => tab.url === data.url)) {
      this.tabList.push(data)
    }
    sessionStorage.setItem('tabState', JSON.stringify({ list: this.tabList, activeTab: this.activeTab }));
  }

  @action popTab(url) {
    this.tabList = this.tabList.filter(item => item.url !== url)
    this.activeTab = this.tabList.length ? this.tabList[this.tabList.length - 1].url : ''
    sessionStorage.setItem('tabState', JSON.stringify({ list: this.tabList, activeTab: this.activeTab }));
  }

  @action changeTab(url) {
    this.activeTab = url
    sessionStorage.setItem('tabState', JSON.stringify({ list: this.tabList, activeTab: this.activeTab }));
  }

  @action changeLoading() {
    this.loading = !this.loading
  }
}

const PublicStore = new Public()

export default PublicStore
