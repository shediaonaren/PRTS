"ui";

//变量初始化
var debug = true;
var ver = "0.6.0";
var num;
var err = 1;
var thread_play_isAlive = 0;
var thread_test_isAlive = 0;
var thread_credit_isAlive = 0;
var thread_construction_isAlive = 0;
var window = 1;
var ready = 1;
var window_main;
var window_header;
var mouseTime;
var w_width = 430;
var w_height = 380;
var sort = [];
var bg;
var background = [];

// 打乱背景图片顺序
for (var i = 1; i <= 25; i++) {
    sort.push(i);
}
// sort = sort.sort(function() { return .5 - Math.random(); }); //非完全打乱
for (let i = 1; i < sort.length; i++) {
    var rd = Math.floor(Math.random() * (i + 1));
    [sort[i], sort[rd]] = [sort[rd], sort[i]];
}

for (let i of sort.slice(0, 3)) {
    bg = 'file://res/bg/' + i + '.png';
    background.push(bg);
}

//坐标转换
setScreenMetrics(1080, 2340);

//界面
ui.statusBarColor("#FFC0CB");
ui.layout(
    <vertical bg="#ffffff">
        <horizontal gravity="center_horizontal" bg="#FFC0CB">
            <text text="PRTS作战代理" h="100" textColor="#ffffff" textSize="40sp" gravity="center_horizontal|center_vertical" margin="1" />
        </horizontal>
        <horizontal gravity="left_horizontal|center_vertical">
            <text id="start" w="400" h="200" textSize="60sp" line="2" margin="1" textStyle="bold" typeface="monospace" textColor="#FFC0CB" gravity="left_horizontal|center_vertical" />
        </horizontal>
        <horizontal gravity="left_horizontal|center_vertical">
            <text id="use" w="400" h="200" textSize="60sp" line="2" margin="1" textStyle="bold" typeface="monospace" textColor="#FFC0CB" gravity="left_horizontal|center_vertical" />
        </horizontal>
        <horizontal gravity="left_horizontal|center_vertical">
            <text id="info" w="400" h="200" textSize="60sp" line="2" margin="1" textStyle="bold" typeface="monospace" textColor="#FFC0CB" gravity="left_horizontal|center_vertical" />
        </horizontal>
        <text id="ver" w="*" h="100" text="当前版本： 0.6.0" textSize="14sp" margin="1" textStyle="bold" typeface="monospace" textColor="#FFC0CB" gravity="center_horizontal|bottom" />
        <text id="blog" w="*" h="100" text="Modified by 逆熵之光" textSize="14sp" margin="1" textStyle="bold" typeface="monospace" textColor="#FFC0CB" gravity="center_horizontal|top" />
    </vertical>
);
ui.start.setText(" 开\n 始");
ui.use.setText(" 说\n 明");
ui.info.setText(" 关\n 于");

// 选取随机背景图片
ui.start.attr("bg", background[0]); 
ui.use.attr("bg", background[1]);
ui.info.attr("bg", background[2]);

//界面按钮事件
ui.start.click(() => {
    if (ready == 1) {
        ui.start.setText(" 关\n 闭");
        threads.start(function () { main(); });
        ready = 2;
    } else if (ready == 2) {
        thread_stop();
        ui.start.setText(" 开\n 始");
        window_main.setSize(w_width, 0);
        window_header.setSize(w_width, 0);
        ready = 3;
    } else if (ready == 3) {
        ui.start.setText(" 关\n 闭");
        window_main.setSize(w_width, w_height);
        window_header.setSize(w_width, 60);
        ready = 2;
    }
});
ui.use.click(() => {
    threads.start(function () {
        alert("使用说明", "【权限说明】\n\
（点击开始会自动弹出需要的权限窗口）\n\
1.打开悬浮窗权限\n\
2.打开无障碍服务\n\
3.同意截取屏幕\n\n\
【功能说明】\n\
1.点悬浮窗上侧的深灰色横条可以显示或隐藏悬浮窗；\n\
2.领取任务奖励：不适用于有见习任务的玩家；\n\
3.「+」号和「-」用于设置关卡代理作战次数，在关卡界面点击「开始」，理智不足时不会自动吃药；\n\
4.「任务」、「基建」和「信用」分别用于自动收取（建议从首页开始自动收取）\n\n\
☆【注意：按音量上键会退出软件】☆");
    });
});
ui.info.click(() => {
    threads.start(function () {
        alert("关于", "1.本软件使用Auto.js开发，不盈利；\n\
2.不读取任何游戏数据；\n\
3.原作者：韭菜饺子QwQ（现B站ID：蹦蹦炸弹Pro）\n\
主页：https://space.bilibili.com/3157662\n\
4.修改者：逆熵之光\n\
主页：https://space.bilibili.com/12294062 \n\n\
修改内容为：\n\
1.增加了自动收取基建和信用的功能；\n\
2.优化了自动收取任务奖励的流程。\n");
    });
});
ui.blog.click(() => {
    app.openUrl("https://space.bilibili.com/12294062");
});

// 加载用于识别的图片

// var img_start_red = images.read("res/img/开始行动红.jpg");
// var img_takeover = images.read("res/img/接管作战.jpg");


//主程序
function main() {
    //请求截图权限
    if (requestScreenCapture(true)) {
        toast("请求截图成功")
        setTimeout(function() {
            app.launchApp("arknights-taptap-308") //延迟2s，启动明日方舟
            // home();
        }, 2000)
    } else {
        toast("请求截图失败");
        exit();
    }

    //无障碍服务判断
    if (auto.service == null) {
        toast("请打开无障碍服务");
        sleep(2000);
        auto.waitFor();
    } else {
        toast("无障碍服务已打开");
    }

    //缩小放大界面
    window_header = floaty.rawWindow(
        <horizontal bg="#000000" alpha="0.7" gravity="center_horizontal|center_vertical">
            <text id="title" w="385" text="当前没有操作" textSize="14sp" textColor="#ffffff" gravity="center_horizontal|center_vertical" />
        </horizontal>
    );
    window_header.setTouchable(true);
    window_header.setPosition(0, 150);
    window_header.setSize(w_width, 60);
    //window_header.exitOnClose();
    setInterval(() => { }, 2000);

    //悬浮窗界面
    window_main = floaty.rawWindow(
        <vertical gravity="center_horizontal|center_vertical" bg="#696969" alpha="0.85">
            <horizontal gravity="center_horizontal|center_vertical">
                <button id="subtract" w="53" h="35" text="-" textSize="13sp" gravity="center_horizontal|center_vertical" />
                <text id="num" w="50" h="35" text="0" textSize="14sp" textColor="#ffffff" gravity="center_horizontal|center_vertical" />
                <button id="add" w="53" h="35" text="+" textSize="13sp" gravity="center_horizontal|center_vertical" />
            </horizontal>
            <horizontal gravity="center_horizontal|center_vertical">
                <vertical gravity="center_horizontal|center_vertical" w="78">
                    <button id="b_start" h="35" text="开始" textSize="13sp" gravity="center_horizontal|center_vertical" />
                    <button id="b_test" h="35" text="测试" textSize="13sp" gravity="center_horizontal|center_vertical" />
                </vertical>
                <vertical gravity="center_horizontal|center_vertical" w="78">
                    <button id="b_stop" h="70" text="停止" textSize="20sp" gravity="center_horizontal|center_vertical" />
                </vertical>
            </horizontal>
            <horizontal gravity="center_horizontal|center_vertical">
                <button id="b_construction" w="78" h="35" text="基建" textSize="13sp" gravity="center_horizontal|center_vertical" />
                <button id="b_credit" w="78" h="35" text="信用" textSize="13sp" gravity="center_horizontal|center_vertical" />
            </horizontal>
        </vertical>
    );
    window_main.setTouchable(true);
    window_main.setPosition(0, window_header.getY() + 60);
    window_main.setSize(w_width, w_height);
    //floaty_window.exitOnClose();
    setInterval(() => { }, 2000);

    //按钮事件
    window_main.b_start.click(() => { start_play() });
    window_main.b_stop.click(() => { thread_stop() });
    window_main.b_test.click(() => { start_test() });
    window_main.b_construction.click(() => { start_construction() });
    window_main.b_credit.click(() => { start_credit() });
    window_main.add.on("touch_down", () => {
        var i = 0; //变量i
        mouseTime = setInterval(function () {  //setInterval可一直执行内部函数
            num_add();
            i++  //若过一秒，执行一次i++
        }, 100);
        if (i == 0) {  //i=0时证明无长按事件为单击事件
            num_add();
        }
    });
    window_main.add.on("touch_up", () => { clearInterval(mouseTime); });
    window_main.subtract.on("touch_down", () => {
        var i = 0; //变量i
        mouseTime = setInterval(function () {  //setInterval可一直执行内部函数
            num_subtract();
            i++  //若过100ms，执行一次i++
        }, 100);
        if (i == 0) {  //i=0时证明无长按事件为单击事件
            num_subtract();
        }
    });
    window_main.subtract.on("touch_up", () => { clearInterval(mouseTime); });

    window_header.title.click(() => {
        set_window_status((window + 1) % 2);
    });
    
    // TODO:长按拖动
    var position;
    window_header.title.on('touch', (e) => {
        if (!position) {
            position = [window_header.x - e.getRawX(), window_header.y - e.getRawY()];
        }
    });
    window_header.title.on('touch_up', () => {
        position = null;
    });
    window_header.title.on('touch_move', (e) => {
        let [x, y] = position;
        window_header.setPosition(x + e.getRawX(), y + e.getRawY());
        window_main.setPosition(x + e.getRawX(), y + e.getRawY() + 60);
    });
}

function put_block(x, y, size) {
    var block = floaty.rawWindow(
        <horizontal bg="#A73B02" alpha="0.7" gravity="center_horizontal|center_vertical">
        </horizontal>
    );
    block.setSize(size, size);
    block.setPosition(x - size / 2, y - size / 2);
}

//加号
function num_add() {
    if (thread_play_isAlive == 0) {
        var i;
        i = window_main.num.getText();
        i++;
        window_main.num.setText(i.toString());
    }
}

//减号
function num_subtract() {
    if (thread_play_isAlive == 0) {
        var i;
        i = window_main.num.getText();
        if (i > 0) {
            i--;
            window_main.num.setText(i.toString());
        }
    }
}

//开始代理线程
function start_play() {
    num = window_main.num.getText();
    if (thread_play_isAlive + thread_test_isAlive + thread_construction_isAlive + thread_credit_isAlive == 0) {
        threads.start(function () {
            play(num);
        });
    }
    else {
        threads.start(function () { toast("正在进行其他操作"); });
    }
}

//开始测试线程
function start_test() {
    num = window_main.num.getText();
    if (thread_play_isAlive + thread_test_isAlive + thread_construction_isAlive + thread_credit_isAlive == 0) {
        threads.start(function () {
            // test_findimage();
            test_other();
        });
    }
    else {
        threads.start(function () { toast("正在进行其他操作"); });
    }
}

//开始领取信用线程
function start_credit() {
    if (thread_play_isAlive + thread_test_isAlive + thread_construction_isAlive + thread_credit_isAlive == 0) {
        threads.start(function () {
            credit();
        });
    }
    else {
        threads.start(function () { toast("正在进行其他操作"); });
    }
}

//开始收取基建线程
function start_construction() {
    if (thread_play_isAlive + thread_test_isAlive + thread_construction_isAlive + thread_credit_isAlive == 0) {
        threads.start(function () {
            construction();
        });
    }
    else {
        threads.start(function () { toast("正在进行其他操作"); });
    }
}

//停止所有线程
function thread_stop() {
    threads.shutDownAll();
    thread_play_isAlive = 0;
    thread_test_isAlive = 0;
    thread_construction_isAlive = 0;
    thread_credit_isAlive = 0;
    window_main.num.setText("0");
    log(err);
    if (err == 1) {
        window_header.title.setText("当前没有操作");
    }
    if (err > 5) {
        window_header.title.setText("理智不足或网络中断");
    }
}

//检测模式
function check_mode() {
    var img_start_blue = images.read("res/img/开始行动蓝.jpg");
    var p = images.findImage(captureScreen(), img_start_blue);
    sleep(100);
    if (p) {
        window_header.title.setText("正常识别关卡");
        sleep(200);
        threads.start(function () {
            set_window_status(0); // 隐藏菜单
        });
    } else {
        window_header.title.setText("无法识别关卡");
        sleep(500);
        thread_stop(1);
    }
    img_start_blue.recycle();
    sleep(500);
}

//检测是否有返回键
function check_back() {
    var p;

    while (true) {
        p = images.findMultiColors(captureScreen(), "#313131", [[20, 0, "#313131"], [0, 20, "#313131"]], {
            region: [0, 0, 150, 150],
            threshold: 1
        });
        sleep(200);
        if (p) { break; }
    }
}

//返回
function click_back(sure) { // sure=1为有返回确认，=0为无返回确认
    click(device.height / 20 + random(-10, 10), device.width / 20 + random(-10, 10));
    if (sure) {
        sleep(1000 + random(-20, 20));
        click(device.height / 5 * 3 + random(-10, 10), device.width / 10 * 7 + random(-10, 10));
    }
}

//返回首页
function home(sure) {
    set_window_status(0);
    click(400 + random(-10, 10), 50 + random(-10, 10));
    sleep(1000 + random(-20, 20));
    click(270 + random(-10, 10), 410 + random(-10, 10));
    if (sure) {
        sleep(700 + random(-20, 20));
        click(device.height / 5 * 3 + random(-10, 10), device.width / 10 * 7 + random(-10, 10));    
    }

    set_window_status(1);
}

//隐藏、显示菜单
function set_window_status(status) { // 0为隐藏，1为显示
    window = status; 
    window_main.setSize(status * w_width, w_height);    
}

//返回首页
function back2main() {
    var p_back, p_geer;
    var img_back = images.read("res/img/返回.jpg");
    var img_geer = images.read("res/img/首页齿轮.jpg");
    while (true) {
        p_back = images.findImage(captureScreen(), img_back);
        if (p_back) {
            click(p_back.x + 30, p_back.y + 30);
        } else {
            p_geer = images.findImage(captureScreen(), img_geer);
            if (p_geer) { break; }
        }
        sleep(500);
    }
    img_back.recycle();
    img_geer.recycle();
}

//代理线程
function play(num) {
    err = 1;
    thread_play_isAlive = 1;

    // 读取图片
    var img_start_blue = images.read("res/img/开始行动蓝.jpg");
    var img_start_red = images.read("res/img/开始行动红.jpg");
    var img_over = images.read("res/img/行动结束.jpg");

    // if (debug){
    //     console.show();
    // }

    var b_mode = device.getBrightnessMode();
    var b = device.getBrightness();
    device.setBrightnessMode(0); // 设为手动模式

    check_mode();
    var p;
    for (var i = 1; i <= num; i++) {
        window_header.title.setText("检测蓝色开始行动按钮");
        while (true) {
            p = images.findImage(captureScreen(), img_start_blue); // 蓝色开始行动
            sleep(200);
            if (p) {
                click(p.x, p.y + 15);
                sleep(1000);
                p = images.findImage(captureScreen(), img_start_blue); // 蓝色开始行动
                sleep(200);
                if (p) {
                } else {
                    break;
                }
            } else {
                err++;
                if (err > 5) {
                    window_header.title.setText("未检测到蓝色开始行动");
                    break;
                }
            }
        }
        if (err > 5) {
            break;
        } else {
            err = 1
        }

        window_header.title.setText("检测红色开始行动按钮");
        while (true) {
            p = images.findImage(captureScreen(), img_start_red); // 红色开始行动
            sleep(200);
            if (p) {
                click(p.x + 30, p.y);
                sleep(1000);
                p = images.findImage(captureScreen(), img_start_red); // 红色开始行动
                sleep(200);
                if (p) {
                } else {
                    break;
                }
            } else {
                err++;
                if (err > 5) {
                    // window_header.title.setText("未检测到红色开始行动");
                    break;
                }
            }
        }
        if (err > 5) {
            break;
        } else {
            err = 1
        }

        window_header.title.setText(`当前第${i}次代理`);
        sleep(5 * 1000);  //延迟5s调整屏幕亮度
        device.setBrightness(Math.min(50, b / 2));
        sleep(35 * 1000);  // 延迟35s检测是否战斗结算

        while (true) {
            p_over = images.findImage(captureScreen(), img_over); // 检测是否结算页面
            sleep(200);
            if (p_over) {
                window_header.title.setText("正在进行结算");
                sleep(1000);
                click(p_over.x + 80, p_over.y);
            } else {
                sleep(3000);
                p = images.findImage(captureScreen(), img_start_blue); // 蓝色开始行动
                if (p) {
                    break;
                }
            }
        }
    }
    set_window_status(1); // 结束作战时打开菜单
    device.setBrightness(b);  //恢复原始亮度
    device.setBrightnessMode(b_mode);  //恢复原始亮度模式
    
    // 回收所有图片
    img_start_blue.recycle();
    img_start_red.recycle();
    img_over.recycle();

    sleep(1000);
    thread_stop();
}


//领取奖励
function reward() {
    err = 1;
    var p;
    var no_reward = false;
    thread_test_isAlive = 1
    window_header.title.setText("检测是否首页");
    back2main();
    while (true) {
        p = images.findMultiColors(captureScreen(), "#ffffff", [[20, 0, "#ffffff"], [0, 20, "#ffffff"]], {
            region: [0, 0, 150, 150],
            threshold: 1
        });
        sleep(100);
        if (p) { break; }
    }
    window_header.title.setText("开始领取任务奖励");
    while (true) {
        p = images.findMultiColors(captureScreen(), "#ff5e19", [[1, 0, "#e66229"], [1, 10, "#e66229"]], { // 任务完成数：橙色，任务：深橙色
            region: [device.height / 2, (device.width / 3) * 2],
            threshold: 1
        });
        if (p) {
            click(p.x + random(-20, 0), p.y + random(0, 20));
            sleep(1000);
            p = images.findMultiColors(captureScreen(), "#313131", [[-10, -10, "#313131"], [10, 10, "#313131"]], { // 深灰色
                region: [0, 0, 150, 150],
                threshold: 1
            });
            if (p) {
                break;
            }
        } else {
            window_header.title.setText("没有可领取的奖励");
            sleep(1000);
            // thread_stop();
            no_reward = true;
            break;
        }
    }
    while (true) {
        if (no_reward) { break; }
        p = images.findMultiColors(captureScreen(), "#0098dc", [[50, 50, "#0098dc"], [100, 100, "#0098dc"]], { // 蓝色：任务奖励
            region: [device.height / 2, 0, device.height / 2, device.width / 2],
            threshold: 1
        });
        sleep(50);
        if (p) {
            sleep(50);
            //点击领取
            click(p.x + random(0, 10), p.y + random(0, 10));
            sleep(100);
        } else {
            for (var i = 1; i <= 6; i++) {
                sleep(250);
                click((device.height / 2 + random(0, 10)), ((device.width / 3) * 2 + random(0, 10)));
                sleep(250);
                p = images.findMultiColors(captureScreen(), "#0098dc", [[50, 50, "#0098dc"], [100, 100, "#0098dc"]], {
                    region: [device.height / 2, 0, device.height / 2, device.width / 2],
                    threshold: 1
                });
                if (p) { break; }
            }
            p = images.findMultiColors(captureScreen(), "#0098dc", [[50, 50, "#0098dc"], [100, 100, "#0098dc"]], {
                region: [device.height / 2, 0, device.height / 2, device.width / 2],
                threshold: 1
            });
            sleep(50);
            if (p) { }
            else {
                for (var i = 1; i <= 3; i++) {
                    sleep(200)
                    click(1493 + random(0, 5), 65 + random(0, 5));
                }
                break;
            }
        }
    }
    while (true) {
        if (no_reward) { break; }
        p = images.findMultiColors(captureScreen(), "#0098dc", [[50, 50, "#0098dc"], [100, 100, "#0098dc"]], {
            region: [device.height / 2, 0, device.height / 2, device.width / 2],
            threshold: 1
        });
        sleep(50);
        if (p) {
            sleep(50);
            //点击领取
            click(p.x + random(0, 10), p.y + random(0, 10));
            sleep(100);
        } else {
            for (var i = 1; i <= 6; i++) {
                sleep(250);
                click((device.height / 2 + random(0, 10)), ((device.width / 3) * 2 + random(0, 10)));
                sleep(250);
                p = images.findMultiColors(captureScreen(), "#0098dc", [[50, 50, "#0098dc"], [100, 100, "#0098dc"]], {
                    region: [device.height / 2, 0, device.height / 2, device.width / 2],
                    threshold: 1
                });
                if (p) { break; }
            }
            p = images.findMultiColors(captureScreen(), "#0098dc", [[50, 50, "#0098dc"], [100, 100, "#0098dc"]], {
                region: [device.height / 2, 0, device.height / 2, device.width / 2],
                threshold: 1
            });
            sleep(50);
            if (p) { }
            else {
                break;
            }
        }
    }
    if (!no_reward) { 
        click_back();
    }
    thread_stop();
}

//领取信用
function credit() {
    err = 1;
    var p;
    var i = 0; // 重复检测次数
    var j = 0; // 成功领取次数
    thread_credit_isAlive = 1;
    window_header.title.setText("检测是否首页");
    back2main();
    sleep(500 + random(-20, 20));

    click(device.height /4 + random(-10, 10), device.width / 5 * 4 + random(-10, 10)); //点击首页的好友
    window_header.title.setText("开始领取信用");
    set_window_status(0); // 隐藏菜单
    sleep(1000 + random(-20, 20));

    check_back();
    sleep(500);

    click(device.height / 10 + random(-10, 10), device.width / 7 * 2 + random(-10, 10)); //点击好友列表
    sleep(3000 + random(-20, 20));

    click(device.height * 0.65 + random(-10, 10), device.width * 0.2 + random(-10, 10)); //访问第一个好友的基建
    sleep(1000 + random(-20, 20));

    check_back();

    while (true) {
        p = images.findMultiColors(captureScreen(), "#D15806", [[10, 0, "#D15806"], [0, 10, "#D15806"]], { // 访问下位：亮橙色
            region: [device.height / 5 * 4, device.width / 5 * 4, device.height / 5, device.width / 5],
            threshold: 1
        });
        sleep(500);
        if (p) { 
            sleep(500 + random(-50, 50));
            i = 0;
            j++;
            click(p.x + random(-10, 10), p.y + random(-10, 10));
            sleep(500 + random(-50, 50));
            if (j >= 10){
                break;
            }
        } else if (i <= 4){
            i++;
            sleep(1000 + random(-50, 50));
            continue;
        } else{
            break;
        }
    }

    window_header.title.setText("信用领取完成");
    sleep(2000);
    check_back();
    window_header.title.setText("返回首页");
    sleep(500);
    home(1);
    set_window_status(1);

    thread_stop();
}


//收取基建
function construction() {
    err = 1; 
    var j = false; // 判断基建是否需要收取
    var p;

    thread_construction_isAlive = 1;
    window_header.title.setText("检测是否首页");
    back2main();
    sleep(500 + random(-20, 20));

    while (true) {
        p = images.findMultiColors(captureScreen(), "#1f9bd3", [[0, 10, "#d4d5d7"], [0, -10, "#ffffff"]], { // 基建提醒标志
            region: [device.height / 7 * 5, device.width / 5 * 4 - 20, device.height / 7 * 2, device.width / 5 + 20],
            threshold: 1
        });
        sleep(100);
        if (p) { 
            window_header.title.setText("开始收取基建");
            set_window_status(0); // 隐藏菜单
            click(p.x + random(-30, -50), p.y + random(20, 50));
            sleep(200);
            j = true;
            break;
        } else{
            window_header.title.setText("基建无需收取");
            break;
        }
    }
    if (j) {
        check_back();
        sleep(2500);
        click(device.height * 0.93, device.width * 0.12);
        for (var i = 0; i <= 3; i++) {
            sleep(2000);
            click(device.height * 0.15, device.width * 0.95);
        }
        window_header.title.setText("基建收取完成");
        // home(1);
    }

    sleep(1000);
    thread_stop();

}

//测试
function test_findimage() {
    thread_test_isAlive = 1
    window_header.title.setText("正在测试找图");
    console.show();
    var p;
    var img_test = images.read("res/img/行动结束.jpg");
    while (true) {
        p = images.findImage(captureScreen(), img_test);
        console.log(p);

        if (p) {
            console.log("已检测到！");
            img_test.recycle();
            sleep(200);
            if (debug){
                put_block(p.x, p.y, 20);
            }
            threads.start(function () {
                set_window_status(0); // 隐藏菜单
            });
            click(p.x + 50, p.y + 30);
            break;
        } else {
            console.log("未检测到！");
        }
        sleep(1000);
    }

    thread_stop();
}

function test_other() {
    thread_test_isAlive = 1
    window_header.title.setText("正在测试");
    console.show();
    var b = device.getBrightness();
    log(`当前亮度为${b}`)
    sleep(3000);
    device.setBrightness(50);
    log(`当前亮度为50`)
    sleep(3000);
    device.setBrightness(b);
    log(`当前亮度为${b}`)

    thread_stop();
}
