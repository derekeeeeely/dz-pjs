extern crate rand;

use rand::Rng;
use std::cmp::Ordering;
use std::io;

fn main() {
    println!("Guess the number!");

    println!("Please input your guess.");

    let secret_num = rand::thread_rng().gen_range(1, 100);

    loop {
        let mut guess = String::new();

        io::stdin()
            .read_line(&mut guess)
            .expect("Failed to read line");

        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => continue,
        };

        // guess.cmp(&secret_num) 表示调用cmp方法比较guess和&secret_num
        // match表达式由多个分支组成，
        // 一个分支包含模式(Ordering::Less)和对应执行代码(println!("Too small!"))
        // 根据cmp返回值检查分支的模式，匹配时执行关联代码
        // eg：cmp返回值为Ordering::Less，匹配到第一个模式，执行println!("Too small!")
        match guess.cmp(&secret_num) {
            Ordering::Less => println!("Too small!"),
            Ordering::Greater => println!("Too big!"),
            Ordering::Equal => {
                println!("You win!");
                break;
            }
        }
    }

    println!("Secret number is: {}", secret_num);
}
