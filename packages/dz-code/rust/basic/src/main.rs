// use std::io;
use std::io::{self, Write};
use std::collections::*;
mod sound;


fn main() {
    println!("Hello, world!");

    // 变量、类型
    const MAX_NUM: i32 = 10000; // 常量全大写加下划线，不可变
    let a = "asss"; // rust的赋值语句不返回值，所以不存在连等
    let a = a.len();
    let mut b = "asss";
    b = "123";
    // b = 123; mut和shadow的区别在于利用let进行shadow是新建一个同名变量，可以类型不同
    // 而mut可以重新赋值但是不可以改变类型

    // 数据类型：每个值都属于某一个数据类型
    // rust为静态类型语言，编译时就需要知道所有变量的类型
    // 数据类型分为： 标量类型和复合类型

    // 标量类型：整型、浮点型、布尔型、字符型
    let a: i32 = 123; // 默认i32
    let a = 123.123; // 默认f64
    let a: bool = true;
    let a: char = 's'; // 字符用单引号，字符串用双引号

    // 复合类型：元组（tuple）、数组（array）
    let a: (i32, f64, bool) = (12, 2.3, false); // 元组内元素类型可以不一致
    let (x, y, z) = a; // 通过模式匹配解构
    let x = a.0; // 通过索引访问
    // print!("{} {}\n", y, x);

    let a: [i32; 3] = [1, 2, 3]; // 数组内元素类型需要一致，数组一旦声明，长度不能增减
    let x = a[0]; // 通过下标访问

    // 数组类型为[type; length] 越界访问会panic

    let x = test_func(x, z);
    // println!("{}\n", x)
}

fn test_func(x: i32, y: bool) -> i32 {
    // 函数
    // 命名：snake case 全小写加下划线
    // 形参：必须声明类型
    // 返回值：默认返回最后一个表达式的值，需要用->声明返回值类型
    // print!("{} {}\n", x, y);

    // rust的语句执行操作不返回值，表达式返回值，rust是基于表达式的
    let z = {
        x + 1 // 表达式的结尾没有分号
    };
    // {x+1}这是一个表达式，返回的是x+1的值，然后再赋值给z，赋值是语句


    // if 的条件表达式返回值必须为bool，不会隐式转换
    if z > 1 {
        // print!("{}\n", z);
    };

    // {} 代码块的值为最后一个表达式的值，if表达式可以放在右侧
    let z = if z > 1 {
        5
    } else {
        6
    };

    let mut m: i32 = 1;

    // loop表达式也可放右侧，break用于退出循环，可以后接表达式作为返回值
    let z = loop {
        m += 1;
        if m >= 10 {
            break m + 1;
        }
    };

    // print!("{}\n", z);

    let arr = [2,3,4,5,6];

    for ele in arr.iter() {
        // println!("{}", ele);
    }

    for ele in (11..20).rev() {
        // println!("{}", ele);
    }

    // let fibarr = fib();

    // for ele in fibarr.iter() {
    //     println!("{}", ele);
    // }

    ownership();


    5 // 这是最后一个表达式，默认返回这个
}

fn fib() -> Vec<usize>{
    println!("please input n \n");
    let mut n = String::new();
    // read_line读到的是string类型
    io::stdin().read_line(&mut n).expect("wrong n");
    let n: usize = match n.trim().parse() {
        Ok(result) => result,
        Err(_) => 10, // 默认10
    };

    println!("n is {}\n", n);

    let mut v: Vec<usize> = Vec::new();

    match n {
        1 => v.push(1),
        2 => {
            v.push(1);
            v.push(1);
        },
        _ => {
            v.push(1);
            v.push(1);
            let mut ele: usize = 2;

            while ele < n {
                // v.get()得到的是option<T>，值不可直接用于计算，但是越界得到的是none
                // v[]得到的是值，但是越界会报错
                let one = v[ele - 1];
                let two = v[ele - 2];
                v.push(one + two);
                ele += 1;
            }
        }
    }


    return v

}

// heap & stack
// 栈后进先出，数据存放在栈顶，且大小已知
// 比如函数执行时，实参的地址指针（实际数据位于堆上）和函数局部变量压入栈中，执行完毕后出栈
// 堆分配内存时，标记某一块为已使用并返回地址（指针）

// ownership
// 每个值一定有且只有一个owner变量
// owner变量离开作用域时，值被舍弃
fn ownership() {
    // - 作用域
    let mut s = String::from("hello");
    s.push_str(", world!");
    // print!("{}\n", s);

    // - move和clone
    // 这里的5存在栈中，发生的是clone
    let x = 5;
    let y = x;

    // 这里的“hello”在堆上，发生的是move，拷贝的是指针，s1会失效
    let s1 = String::from("hello world");
    let s2 = s1;
    // 调用clone，这样会拷贝“hello”，s2不会失效，clone消耗大，慎用
    let s3 = s2.clone();
    let mut s4 = s2.clone();
    let s5 = s2.clone();
    // print!("{} {}\n", s2, s3);

    // - Copy类型
    // 任何不需要分配内存或某种资源的类型、任何简单标量值得组合都是Copy的
    // Copy的类型在发生移动后依然可以使用

    // - 发生转移的情况：返回值、函数调用
    // 这里发生了x = s3的赋值，发生了move，s3失效了
    somefunc(s3);
    // println!("{}", s3); 这样是会报错的
    // x move到函数中，但是i32是copy，所以x还可以用
    somefunc2(x);
    // println!("{}", x);

    somefunc3(&s2, &mut s4); // 可以理解s2的value实际上是指针，指向堆上“hello”的地址
    // & 引用也即是取址，将地址传递到somefunc3的形参x，即发生了
    // x的value为s2的地址，s2的value为“hello”地址
    // s2此时不会失效（之前的失效是为了保证不能有两个指针指向同一个堆上内存地址，而这里是x指向s2，s2指向hello）

    // s2被转移到调用方了
    // return s2

    let ind = somefunc4(&s5);
    println!("found {}", ind);


} //在这里会调用drop将离开作用域的变量(owner)的值(实际值)自动清理
// 如果数据已经转移则不会发生啥

fn somefunc(x: String) {

}

fn somefunc2(x: i32) {

}

// 接收值为String类型的变量引用(指针)
// 取值 * 解引用
// 取址 & 引用
// 在任意给定时间，要么 只能有一个可变引用，要么 只能有多个不可变引用。
// 传递引用被称为借用
// 需要所有权去改变传进来的参数的值时传值，不需要则传指针就可以
// 传指针时调用方后续还可以使用值，即传的是指针，使被调用函数的局部变量指向实参的地址
fn somefunc3(x: &String, y: &mut String) -> String{
    // println!("{}", *x);
    // println!("x.len is {}", x.len());
    // 默认不允许修改引用的值
    // x.push_str(", world!") 这样会报错

    // y: &mut String 为可变引用
    // 限制：在特定作用域中的特定数据有且只有一个可变引用
    y.push_str(", world!");
    // println!("y is {}", *y);

    let s = String::from("jelo");

    // return &s 这样是不对的，因为离开somefunc3以后s会被释放，返回s的一个引用会报错

    s //直接返回s是ok的，因为这里把s的值得owner（变量）（所有权）交出去了
    // 离开作用域时就不用释放了
}

// slice是一个不可变引用，是没有所有权的类型
fn somefunc4(s: &String) -> &str{

    // slice (start..end) 索引从start开始不包含end
    // (start..=end) 包含end
    let sd = String::from("merry chrismas!");
    let word = &sd[0..5];
    println!("word slice is {} \n", word);

    // 字符串字面量就是一个slice，所以是不可变的
    let a = "hello you";

    let r = Rectangle { width: 30, height: 50 };

    // let res = area(&r);

    let res = r.area();

    let anotherRec = Rectangle::create(40);

    println!("anotherRec is {:#?}", anotherRec);

    println!("res of area is {}", res);

    enum_test();

    let bytes = s.as_bytes(); // 变成字节数组
    // iter创建一个迭代器，返回集合中每个元素，enumerate包装iter的返回成一个元组
    // 元组的第一个元素为索引，第二个为元素的引用
    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i]
        }
    }
    return &s[..]
}

#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

// 定义结构体的方法和关联函数
impl Rectangle {
    // 方法，第一个参数为&self
    fn area(&self) -> u32 {
        self.width * self.height
    }
    // 关联函数通过::调用，参数不是&self
    fn create(size: u32) -> Rectangle {
        Rectangle { width: size, height: size }
    }
}

// fn area(rectangle: &Rectangle) -> u32 {
//     println!("rec is {:#?}", rectangle);
//     return rectangle.width * rectangle.height
// }

// param | &mut param | &param做参数，最后一种为不可变借用，不改变原值（只读不写），第二中为可变借用
// impl块组织结构体的方法便于管理


// 成员可以为多种类型
#[derive(Debug)]
enum Message {
    Quit, //不关联数据
    Move { x: u32, y: u32 }, //这是一个匿名结构体
    Write(String), //包含一个String
    ChangeColor(i32, i32, i32), //包含3个i32 类似元组结构体
}

// 枚举的impl块定义方法
impl Message {
    fn call(&self) {

    }
}

fn enum_test() {
    let ms = Message::Write(String::from("hello"));
    ms.call();
    let a = Some(12);
    let b = Some("hello");
    let c: Option<u32> = None; // None需要指定Option<T>的类型T

    // match 表达式 { pattern 模式 => { code 代码 } }
    // pattern只能是编译期已知的，不能是运行时，所以要用ref 一个mystr，判断mystr是否正确
    match ms {
        Message::Write(ref mystr) if mystr == "hello" => {
            println!("this is hello");
        },
        _ => {
            println!("this is not hello");
        }
    }
    let s5 = Some(5);
    let s7 = plus_two(s5);
    println!("s7 is {:#?}", s7);

    modefn();
}

// rust不存在空值null，存在一个Option枚举
// enum Option<T> {
//     Some(T),
//     None,
// }

// 只要一个值不是Option<T>类型就可以认定一定不为空

// match 修改匹配模式的值
fn plus_two (x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 2),
    }
    // let test = Some(12);

    // return 23

    // if let 模式 = 表达式
    // 和if条件是不一样的，注意
    // if let Some(12) = test {

    // } else {

    // }
}

mod sound2 {
    // 默认私有，pub改成公有
    pub mod instrument {
        pub fn clarinet() {
            // 函数体
            // super表示从父模块开始
            super::breathe_in();
        }
    }
    fn breathe_in() {

    }
}

fn trymod() {
    // 绝对路径
    crate::sound2::instrument::clarinet();

    // 相对路径
    sound2::instrument::clarinet();
}

mod plant {
    #[derive(Debug)]
    pub struct Vegetable {
        pub name: String,
        id: u32,
    }
    impl Vegetable {
        pub fn new(name: String) -> Vegetable {
            Vegetable {
                name,
                id: 1,
            }
        }
    }
}

fn modefn() {
    let mut v = plant::Vegetable::new(String::from("hello"));
    println!("yooo {}", v.name); // name是公有的，id私有，换成id会报错
    sound::instrument::ins();
    go_vector()
}

enum EnForVector {
    Int(i32),
    Float(f64),
    Text(String),
}

// vector
fn go_vector() {
    let v = vec![1,2,3];
    let f: &i32 = &v[0];
    let mut vv = vec![5,6,7];

    // 这样是会报错的，因为f为指向vec[0]的指针
    // 但是在vector更新时可能会由于不存在一块连续内存来连续存储，
    // 可能会发生重新开辟内存复制过去，这个时候f就指向空了
    // 为避免这种情况，程序上限制了这样的操作。
    // v.push(4);

    for i in &v {
        // 这里用&v是为了后续可以继续使用v
        // 牢记赋值会导致失去引用（新的变量指向数据地址空间，旧的就无效了）
        // 这里换成v的话下面的v[0]就会panic了
        println!("item: {}", i);
    }

    for i in &mut vv {
        // &mut 也是ok的
        *i += 50;
        println!("item: {}", i);
    }

    println!("item: {}", v[0]);
    println!("item: {}", vv[0]);

    // v.get(0) // 越界时返回None
    // v[0] //越界时panic

    // 定义枚举，以便在vector中存储不同类型的值
    let vvv = vec![EnForVector::Float(1.2), EnForVector::Int(2), EnForVector::Text(String::from("hello"))];
    go_string();
}

// string
// String类型 & string slice类型 (&str)
fn go_string() {
    // new
    let s = String::new();
    let s = "hello world".to_string();
    let s = String::from("hello world");

    let mut s1 = String::from("hello");
    let s2 = String::from("world");
    s1.push_str(&s2); // borrow
    println!("s1 {}, s2 {}", s1, s2);

    s1.push('!'); // push单个字符
    let s3 = s1 + &s2; // s1 move了，后续不能使用了
    // fn add(self, s: &str) -> String {}

    println!("s2 is {}, s3 is {}", s2, s3);

    let s1 = String::from("tic");
    let s2 = String::from("tac");
    let s3 = String::from("toe");

    let s = format!("{}-{}-{}", s1, s2, s3);

    println!("sis {}", s);

    go_hashmap();

    // rust的字符串不支持下标索引
}

fn go_hashmap() {
    let mut hm = HashMap::new();
    hm.insert("alpha", 1);

    let teams  = vec![String::from("Blue"), String::from("Yellow")];
    let initial_scores = vec![10, 50];

    let mut scores: HashMap<_, _> = teams.iter().zip(initial_scores.iter()).collect();
    // zip将两个vector合成一个元组vecor，再调用元组vector的collect方法转为HashMap
    // HashMap是同质的，HashMap<_, _>类型应一致特定，下划线占位则rust可以进行推断
    let field_name = String::from("Favorite color");
    let field_value = String::from("Blue");

    let mut map = HashMap::new();
    map.insert(&field_name, &field_value);
    println!("field name is {}, field value is {}, map is {:?}", field_name, field_value, map.get(&field_name));

    let mut scores = HashMap::new();
    scores.entry(String::from("Yellowp")).or_insert(44);


    for (k, v) in &map {
        println!("{:?} : {:?}", k, v);
    }

    go_trait()


}

// trait 需要在当前作用域才可以为结构体实现trait
fn go_trait() {
    #[derive(Debug)]
    struct Tweet {
        pub from: String,
        pub to: String,
        pub content: String,
    }
    // 类似于方法集合
    pub trait Summary {
        fn summarize(&self) -> String;

        // 默认实现
        fn otherInfo(&self) -> String {
            String::from("@ tweet")
        }
    }

    // 该结构体实现这个trait，并定义方法的具体实现
    impl Summary for Tweet {
        fn summarize(&self) -> String {
            format!("from {} to {} : {},other info is {}", self.from, self.to, self.content, self.otherInfo())
        }
    }

    let tw = Tweet {
        from: String::from("derek"),
        to: String::from("mona"),
        content: String::from("hello"),
    };

    // 正常调用
    println!("{:?}", tw.summarize());

}





