package main

import (
  "fmt"
  "reflect"
)

// rule 1:
// Reflection goes from interface value to reflection object

// func TypeOf(i interface{}) Type
// reflect用于获取interface变量的类型和值

func ref() {
  a := 12.2
  t := reflect.TypeOf(a)
  v := reflect.ValueOf(a)
  // a先被转换成实现了interface{}的实现，类似于js转化为相应对象
  fmt.Println("the type of a is: ", t)
  fmt.Println("the value of a is: ", v, v.Type(), v.String())
}

// rule 2:
// Reflection goes from reflection object to interface value

// rule 3:
// To modify a reflection object, the value must be settable

