use std::env;
use std::process;

use demo;
use demo::Config;

fn main() {
    // env.args()返回一个迭代器，collect方法返回一个集合类型，这里指定为vector
    let args: Vec<String> = env::args().collect();
    // args借用给parse_config 传指针&args
    // 返回为Result，需要unwrap
    let config = Config::new(&args).unwrap_or_else(|err| {
        // unwrap_or_else 在返回Ok时相当于unwrap
        // 返回Err时，会调用一个闭包，将Err的内部值传给|err|，闭包内可调用
        // 类似catch
        println!("Problem parsing arguments: {}", err);
        process::exit(1);
    });

    if let Err(e) = demo::run(config) {
        println!("Application error: {}", e);
        process::exit(1);
    };

}


