define( ["./httpflow", "http", "fs", "./mapper"], function( Flow, http, fs ){
    var services_path = __dirname +"/services";
    var services = fs.readdirSync(services_path);
    var urls = []
    services.forEach(function(name){
        if(name.substr(-3,3) ==".js")
            urls.push( $.path.join(services_path, name) )
    });
    services =  $.require(urls);

    $.mix({
        pagesCache: {}, //用于保存静态页面,可能是临时拼装出来的
        viewsCache: {}, //用于保存模板函数
        staticCache: {}, //用于保存静态资源,
        controllers: {}  //用于保存控制器,
    });
    
    http.createServer(function(req, res) {
        var flow = new Flow()//创建一个流程对象，处理所有异步操作，如视图文件的读取、数据库连接
        flow.patch(req, res)
        services.forEach(function(fn){
            fn(flow);//将拦截器绑到流程对象上
        });
//        flow.res.writeHead(200, {
//            'Set-Cookie': 'myCookie=test',
//            'Content-Type': 'text/plain'
//        });
//        flow.res.end('这是到达action时生成的\n');
    }).listen( $.config.port );
    $.log($.config.port,"red", 7)

})