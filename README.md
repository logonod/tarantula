# Tarantula

Tarantula是一个分布式爬虫框架。由中心服务器和节点服务器构成。  
官方网站: http://tarantula.tech

## 环境依赖
- Node \>= 8.9.1
- Mysql or Mariadb
- Python2
- Visual Studio >= 2012 (windows only)

## 安装
`npm i -g tarantulajs --unsafe-perm`

## 创建工程
`tarantula dev --create YOUR_PROJECT_NAME`

#### 编写代码
`vi YOUR_PROJECT_NAME/main.js`

#### 测试代码
`tarantula dev --test <scriptPath>`

## 使用官方节点服务器工作

#### 发布代码到官方服务器
`tarantula publish --name YOUR_PROJECT_NAME --description YOUR_DESCRIPTION --target YOUR_PROJECT_DIRECTORY`

## 私有化部署

#### 初始化配置文件
`tarantula server --init`

*database.json 设置mysql数据库信息*  
*tarantula-config.json 项目配置*


#### 启动服务器
`tarantula server --start --db-config <path> --config <path> [-p [port]]`

#### 客户端
`tarantula dispatch -s http://YOUR_SERVER:PORT --token <string>`

#### 客户端docker部署
`docker build -t tarantula-dispatch -f https://raw.githubusercontent.com/hummer-studio/tarantula/master/Dockerfile.dispatch . --build-arg server=http://YOUR_SERVER:PORT --build-arg token=YOUR_TOKEN`  
`docker run --restart=always tarantula-dispatch`

#### 发布代码到私有服务器
`tarantula publish -s [https://]YOUR_SERVER[:PORT] --name YOUR_PROJECT_NAME --description YOUR_DESCRIPTION --target YOUR_PROJECT_DIRECTORY`


## 示例代码
- [多任务](../../tree/master/examples/crawl_multi_task)
- [图片下载](examples/crawl_image.js)
- [源码解析](examples/crawl_no_javascript.js)
- [点击事件通过jquery解析](examples/crawl_with_javascript.js)

## 常见问题
#### 全局模式安装失败
可以尝试普通安装模式
```shell
mkdir workdir
cd workdir
npm i tarantulajs
./node_modules/.bin/tarantula --help
```
