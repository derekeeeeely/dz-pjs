package main

import "fmt"

// interface定义了一组方法，对象如果实现了所有方法，则对象实现了该接口

type Men interface{
  sayHi()
  sing()
  write()
}

type Student struct{
  name string
}

type Teacher struct{
  name string
}

// 问题来了，如果几个对象或者说几个struct都实现了同一个interface，
// 那么这几个struct类型的对象就具有相似性，我们可以搞事情，比如把他们丢一个slice里面
// maybe 特征/分类？


func (st Student) sayHi(){
  fmt.Println(st.name, "can sayhi \n")
}

func (st Student) sing(){
  fmt.Println(st.name, "can sing \n")
}

func (st Student) write(){
  fmt.Println(st.name, "can write \n")
}

func (te Teacher) sayHi(){
  fmt.Println(te.name, "can sayhi \n")
}

func (te Teacher) sing(){
  fmt.Println(te.name, "can sing \n")
}

func (te Teacher) write(){
  fmt.Println(te.name, "can write \n")
}

// 空interface可以用在存储任何类型值的场景
type anyType interface{

}

// interface作为参数？
// 例如Println实际上可以接收所有实现了String()方法的对象类型
// 因为Println接收stringer 接口，此接口只包含一个String()方法
// 这一点可以用来定制化输出

func sss() {
  Tom := Student{"Tom"}
  Tom.sayHi()
  Tom.sing()
  Tom.write()
  Tony := Teacher{"Tony"}
  Tony.sayHi()
  Tony.sing()
  Tony.write()
  someone := []Men{Tom, Tony}
  for _, value := range someone{
    fmt.Println(value)
  }
}

// 判断iterface变量存储的类型
// value, ok = element.(T)


// 嵌入interface，类似struct嵌入
type ExtendedMen interface{
  Men
  push(x interface{})
  pop() interface{}
}
