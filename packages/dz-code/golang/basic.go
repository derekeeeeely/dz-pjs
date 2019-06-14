package main

import (
	"fmt"
	// "math"
	"runtime"
)

// sublime go run(不编译二进制文件)处理函数调用时有问题，貌似不会去找同目录底下其他文件

func basic() {
	// defer栈，后进先出
	defer fmt.Printf(" world! \n")
	defer fmt.Printf(" ---- ")

	fmt.Printf("hello \n")
	variables()
	arr()
	// makeNew()
	fmt.Println(condition(1, 2))
	dzfunc(3, 4, 6, 7)
	x := 1
	dzfuncpointer(&x)
	// sqrt(12, 10)

	hum := Human{10, "derek"}
	per := Person{hum, "hello", 12}
	fmt.Println(per.age, per.Human.age)

	bxs := Boxs{
		Box{1, 2, 3, "red"},
		Box{2, 3, 4, "blue"},
	}

	// 传址
	bxs[1].changeColor("yellow")
	nbx := NewBox{bxs[1]}

	// method继承，可重写
	nbx.changeColor("pink")

	fmt.Println(bxs, nbx)
	// sss()
}

func variables() {
	var a int = 1
	b := 2
	// 不同类型计算时不会隐式转换，需强转，否则会报错
	const (
		c = iota
		d = "as"
		e = iota
		f = iota
	)
	fmt.Println("var", a, b, c, d, e, f, "\n")
}

func arr() {
	// arr
	var a [6]int
	b := [...][2]int{{1, 2}}

	// slice，包含三个东西，指向数组第一个位置的指针、cap、len
	c := []int{11, 12, 13}
	d := a[1:4]
	// append如果超出cap会分配新的数组空间，改变指针指向
	d = append(d, 10, 11, 12, 13, 1)
	// 指向改变后修改d，不影响a
	d[0] = 4

	for k, v := range c {
		fmt.Println(k, v)
	}

	// struct
	type person struct {
		name string
		id   int
	}

	derek := person{"derek", 12}
	p := &derek

	// map，和slice一样是引用类型，长度不定
	var n map[string]string
	m := make(map[string]person)
	m["derek"] = person{"derek", 41}
	v, ok := m["derek"]

	mm := map[string]int{"a": 1, "b": 2}

	fmt.Println("arr", a, b, c, len(c), cap(c), d, len(d), cap(d), "\n", derek, p, m, len(m), n, v, ok, mm, "\n")
}

func makeNew() {
	// make用于map, slice, channel分配内存，返回的是值
	// new用于各种类型分配内存，返回的是指针
}

func condition(m int, n int) (x, y int) {
	// if条件里可以声明变量，作用域为该条件逻辑块
	if v := 12; v > 10 {
		fmt.Println(v)
	}
	for a := 10; a > 5; a-- {
		if a < 8 {
			break
		}
		fmt.Println(a)
	}
	switch os := runtime.GOOS; os {
	case "linux":
		fmt.Println("linux")
	case "darwin":
		fmt.Println("OS X")
	default:
		fmt.Println("%s", os)
	}

	return n, m
}

func dzfunc(arg ...int) {
	// 接收变参，函数体内arg变量是一个slice
	for _, n := range arg {
		fmt.Printf("%d \t", n)
	}
}

func dzfuncpointer(poi *int) int {
	// 传址好处，节省copy的开销
	*poi = *poi + 12
	fmt.Println(*poi)
	return *poi
}

// // 牛顿法实现简单的开根号
// func sqrt(x float64, times int) float64 {
//   var x0 float64

//   // 选取初值
//   for i := 0; float64(i*i) < x; i++ {
//     x0 = float64(i)
//   }

//   fmt.Println(x0, "first value")

//   // 迭代
//   for i := 0; i < times; i++ {
//     x0 = x0 - (x0*x0-x)/(2*x0)
//   }

//   return x0
// }

// 声明函数类型，可以将函数作为参数传递
type funcStruct func(int) int

func receivefunc(f funcStruct) {
	// f()
}

type Human struct {
	age  int
	name string
}

type Person struct {
	Human
	string
	age int
}

type Rectangle struct {
	width  float64
	height float64
}

func (r Rectangle) area(x, y float64) (ar float64) {
	return x * y
}

type Color string

type Box struct {
	width  float64
	height float64
	length float64
	color  Color
}

type NewBox struct {
	Box
}

type Boxs []Box

func (b *Box) changeColor(col Color) *Box {
	b.color = col
	return b
}

func (b *NewBox) changeColor(col Color) *NewBox {
	b.color = "123"
	return b
}
