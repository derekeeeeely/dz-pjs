package main

import (
  "fmt"
)

// 牛顿法实现简单的开根号
func sqrt(x float64, times int) float64 {
  var x0 float64

  // 选取初值
  for i := 0; float64(i*i) < x; i++ {
    x0 = float64(i)
  }

  fmt.Println(x0, "first value")

  // 迭代
  for i := 0; i < times; i++ {
    x0 = x0 - (x0*x0-x)/(2*x0)
  }

  fmt.Println(x0, "final value")
  return x0
}
