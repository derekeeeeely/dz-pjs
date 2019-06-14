use std::fs;
use std::error::Error;

#[derive(Debug)]
pub struct Config {
    pub query: String,
    pub filename: String,
}

impl Config {
    pub fn new(args: &[String]) -> Result<Config, &'static str> {
        if args.len() < 3 {
            return Err("not enough arguments");
        }
        let query = args[1].clone();
        let filename = args[2].clone();
        Ok(Config { query, filename })
    }
}

pub fn run(config: Config) -> Result<(), Box<dyn Error>>{
    let content = fs::read_to_string(config.filename)?;

    println!("with content: \n{:?}", content);
    Ok(())
}

pub fn generate_work() {
    // 定义一个闭包，存储在变量col中
    // col包含一个匿名函数的定义
    let col = |num, times| {
        (num, times)
    };

}