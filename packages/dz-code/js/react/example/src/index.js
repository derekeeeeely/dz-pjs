import React, {Component} from 'react'
import ReactDom from 'react-dom'

//All React components must act like pure functions with respect to their props
const App = (props) => {
  return (
    <div>
      I'm a function component
      {props.children}
    </div>
  )
}

const Conditional = (props) => {
  if (!props.show) {
    // 不影响生命周期
    return null
  }
  return (
    <div>show</div>
  )
}

class ClassComponent extends Component{
  constructor(props) {
    super(props)
    this.state = {
      time: new Date()
    }
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.tick()
    }, 1000)
  }

  componentWillUnMount() {
    clearInterval(this.timer);
  }

  // public class fields syntax
  // 不这样的话需要bind this
  tick = () => {
    this.setState({
      time: new Date()
    })
  }

  // setState普通形式、函数形式
  // setState同异步之分
  // 多个setState会被merge
  tock =() => {
    this.setState((prevState, props) => ({
      time: new Date()
    }))
  }

  render() {
    const { time } = this.state
    return (
      <div>
        I'm a class component
        {time.toLocaleTimeString()}
      </div>
    )
  }
}

// 16新增的返回类型
const ArrayEle = () => [1,2,3,4,5,6]
const StringEle = () => 789
const emptyArr = []

// React will call the ref callback with the DOM element when the component mounts
// and call it with null when it unmounts.
// ref callbacks are invoked before componentDidMount or componentDidUpdate lifecycle hooks.
// ref don't work on functional component because it doesn't have an instance
// dom元素如input以及class组件可以添加ref属性，ref属性是一个回调函数，
// 可以获取mount后的组件实例（时间上在didmount和didupdate前，不是dom节点）或者dom节点的refer

ReactDom.render(
  (<App>
    <ClassComponent ref={r => this.cc = r}/>
    <ArrayEle />
    {/*<StringEle />*/}
    {emptyArr.length && <StringEle />}
    versus
    {emptyArr.length > 0 && <StringEle />}
    <Conditional show={false}/>
  </App>),
  document.getElementById('root')
)
