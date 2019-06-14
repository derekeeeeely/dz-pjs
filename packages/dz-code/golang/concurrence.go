package main

import (
	"fmt"
	// "runtime"
)

// func say(s string) {
//   for i := 0; i < 5; i++ {
//     runtime.Gosched()
//     fmt.Println(s)
//   }
// }

func add(a []int, c chan int) {
	total := 0
	for _, v := range a {
		total += v
	}
	c <- total //send total to c
}

func fibonacci(n int, c chan int) {
	x, y := 1, 1
	for i := 0; i < n; i++ {
		c <- x
		x, y = y, x+y
	}
	close(c)
}

func fibonacciSelect(c, quit chan int) {
	x, y := 1, 1
	for {
		select {
		case c <- x:
			x, y = y, x+y
		case <-quit:
			fmt.Println("quit")
			return
		}
	}
}

func concu() {
	// go say("world") //开一个新的Goroutines执行
	// say("hello") //当前Goroutines执行
	a := []int{1, 2, 3, 4, 5, 6}
	// 无缓冲channel，适合在多goroutine间同步
	// channel需要指定存取数据类型
	c := make(chan int)
	go add(a[:len(a)/2], c)
	go add(a[len(a)/2:], c)
	x, y := <-c, <-c
	fmt.Println(x, y)
	// 缓冲型channel,指定缓冲大小，即可以存储的元素个数
	// 超出个数则阻塞，直到其他goroutine从channel中读取，腾出空间
	d := make(chan int, 2)
	d <- 1
	d <- 2
	// d <- 3
	// fmt.Println(<-d)
	// fmt.Println(<-d)

	e := make(chan int, 10)

	go fibonacci(cap(e), e)

	for i := range e {
		fmt.Println(i)
	}

	// select
	// 多个channel的情况，select默认阻塞
	// 在channel数据读取/存入时进行

}
