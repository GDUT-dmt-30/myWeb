function Init() {


    //创建threejs的场景
    var scene = new THREE.Scene();

    // 创建透视摄像机 并且初始化位置
    var camera = new THREE.PerspectiveCamera(
        45, //视场角
        window.innerWidth / window.innerHeight, // 长宽比
        1, // 近景裁剪
        1000 // 远景裁剪
    );
    camera.position.z = 20;
    camera.position.x = 0;
    camera.position.y = 5;
    camera.lookAt(new THREE.Vector3(0, 10, 0));//确保摄像机望向坐标原点

    (function () {
    stats = new Stats();
    stats.setMode(0);
    stats.domElement.position= 'absolute';
    stats.domElement.left = '0px';
    stats.domElement.top = '0px';
    document.body.appendChild(stats.domElement);
    })();

    //创建 webGL的渲染器 这里的设置和上一节一致
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    //为渲染器开启 阴影贴图
    renderer.shadowMap.enabled = true;

    //开启这个 阴影效果会抗锯齿 但是也会卡许多
    //renderer.shadowMapType = THREE.PCFSoftShadowMap;

    //官方说明：Sets device pixel ratio. This is usually used for HiDPI device to prevent bluring output canvas.
    //大意就是针对HiDPI设备（比如使用苹果Retina的）进行的设置，防止输出画面被施加模糊
    renderer.setPixelRatio( window.devicePixelRatio );

    //启用orbit摄像机 需要OrbitControls.js文件支持 可以实现环绕摄像机 支持缩放、平移功能
    var controls = new THREE.OrbitControls( camera, renderer.domElement );

    //将渲染器绑定到html的特定div上 方便以后的DOM操作
    document.getElementById('webGL-output').appendChild(renderer.domElement);

    //添加两个聚光灯 填写参数分别是 强度 和 颜色
        var lightLeft = getSpotLight(0.4, 'rgb(255, 220, 180)');
        var lightRight = getSpotLight(1.25, 'rgb(255, 220, 180)');

    //调整聚光灯的位置
        lightLeft.position.x = 6;
        lightLeft.position.y = 8;
        lightLeft.position.z = 12;

        lightRight.position.x = 50;
        lightRight.position.y = 14;
        lightRight.position.z = -6;

    // 将灯光添加到场景中
        scene.add(lightLeft);
        scene.add(lightRight);

    // var light =  new THREE.AmbientLight(
    //     0xffffff,
    //     angle = Math.PI/2,//光的范围
    //     penumbra = 1//0无光阴圈
    //     );//颜色，强度
    // scene.add(light);

    //导入gui界面
        var gui = new dat.GUI();

    // 添加图形操作界面 滑竿 参数分别代表 控制源 具体属性（控制源的子对象） 最小值 最大值
        gui.add(lightLeft, 'intensity', 0, 10);
        gui.add(lightLeft.position, 'x', -50, 50);
        gui.add(lightLeft.position, 'y', -50, 50);
        gui.add(lightLeft.position, 'z', -50, 50);

        gui.add(lightRight, 'intensity', 0, 10);
        gui.add(lightRight.position, 'x', -50, 50);
        gui.add(lightRight.position, 'y', -50, 50);
        gui.add(lightRight.position, 'z', -50, 50);



    //加载外部模型
//需要OBJLoader.js的支持
    var loader = new THREE.OBJLoader();
    var textureLoader = new THREE.TextureLoader();

//加载模型，以及模型预加载的函数
    loader.load('../model/The City.obj', function (object) {
        //获取颜色贴图和凹凸贴图的路径
        var colorMap = textureLoader.load('../model/maps/cty1.jpg');
        var bumpMap = textureLoader.load('../model/maps/cty2x.jpg');
       // var roughnessMap = textureLoader.load('../model/maps/cty2x.jpg');
        //获取材质，材质函数在下面定义，传入参数 材质类型 颜色
        var faceMaterial = getMaterial('lambert', 'rgb(255, 255, 255)');

        //traverse 对模型的各个部分进行逐一操作，可以用for loop递归来实现
        //traverse 是threejs自带的功能
        object.traverse(function(child) {
            //设置材质以及材质的属性
            child.material = faceMaterial;
            faceMaterial.roughness = 0.375;//粗糙度
            faceMaterial.map = colorMap;//颜色贴图
            faceMaterial.bumpMap = bumpMap;//凹凸贴图
            faceMaterial.roughnessMap = colorMap;//粗糙度贴图
            faceMaterial.metalness = 0;//金属度
            faceMaterial.bumpScale = 0.175;//凹凸程度
            child.material.side = THREE.DoubleSide;//双面材质
        } );

        //放大和移动模型
        object.scale.set(0.01,0.01,0.01);

        object.position.z = 0;
        object.position.y = -2;

        //添加模型
        scene.add(object);
    });

    //调用update函数
    update(renderer, scene, camera, controls,stats);

    //init()函数返回值 返回场景
    return scene;
}

function update(renderer, scene, camera, controls,stats) {

    controls.update();//controls是orbit摄像机的传参用来实现摄像机的更新，不过没有它目前也没问题
    stats.update();
    //这里的写法与前文一致 controls也可以去掉
    renderer.render(scene, camera);
    requestAnimationFrame(function() {
        update(renderer, scene, camera, controls,stats);
    });

    //创建resize函数 在调节窗口大小时三维界面会响应缩放
    window.addEventListener('resize',function(){
        var width = window.innerWidth;
        var height = window.innerHeight;
        renderer.setSize(width,height);
        camera.aspect = width/height;
        camera.updateProjectionMatrix();

    })

}

$(function(){

    //添加按钮的CSS样式
    var full_screen_css = $("<style></style>").text("#full_screen " +
                                                    "{position: fixed;" +
                                                    "bottom: 20px;" +
                                                    "right: 20px;" +
                                                    "padding: 8px;" +
                                                    "color: #fff;" +
                                                    "background-color: #555;" +
                                                    "opacity: 0.7;}" +
                                                    "#full_screen:hover " +
                                                    "{cursor: pointer;opacity: 1;}");
    $("head").append(full_screen_css);

    //添加按钮
    $("#webGL-output").after("<button id=\"full_screen\" onclick=\"full_screen_fun()\">全屏</button>");
});

var full_screen_check = false;//判断全屏状态

function full_screen_fun(){
    if(full_screen_check){//全屏状态
        exitFull();//退出全屏
    }else{
        requestFullScreen(document.documentElement);//  全屏整个网页
    }

};

function requestFullScreen(element) {
    // 判断各种浏览器，找到正确的方法
    full_screen_check = true;
    var requestMethod = element.requestFullScreen || //W3C
        element.webkitRequestFullScreen ||    //Chrome等
        element.mozRequestFullScreen || //FireFox
        element.msRequestFullScreen; //IE11
    if (requestMethod) {
        requestMethod.call(element);
    }
    else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

//退出全屏 判断浏览器种类
function exitFull() {
    full_screen_check = false;
    // 判断各种浏览器，找到正确的方法
    var exitMethod = document.exitFullscreen || //W3C
        document.mozCancelFullScreen ||    //Chrome等
        document.webkitExitFullscreen || //FireFox
        document.webkitExitFullscreen; //IE11
    if (exitMethod) {
        exitMethod.call(document);
    }
    else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

function getMaterial(type, color) {
    var selectedMaterial;
    var materialOptions = {
        color: color === undefined ? 'rgb(255, 255, 255)' : color
    };//这里如果color没有定义直接定义为纯白，否则就color的值

//下面展示了threejs内置的材质(可以加载第三方js来扩展材质,或者通过GLSL语言自己写材质)
    switch (type) {
        case 'basic':
            selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
            break;//这个材质等同于Maya中的surface表面材质，不受灯光影响
        case 'lambert':
            selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
            break;//这个材质等同于Maya中的lambert材质
        case 'phong':
            selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
            break;//这个材质等同于Maya中的phong材质
        case 'standard':
            selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
            break;//这个材质等同于unity的standrad材质
        case 'PBR':
            selectedMaterial = new THREE.MeshPhysicalMaterial(materialOptions);
            break;//PBR材质
        default:
            selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
            break;
    }

    return selectedMaterial;
}

//聚光灯构造函数
function getSpotLight(intensity, color) {
    /*
        a = a == b ? b++ : 0
        这个就是如果a等于b成立，就返回b++，如果不成立，就返回0

        等价于
        if(a==b)
            a = b++
        else
            a = 0
    */
    //设置颜色，如果color没有定义直接定义为纯白，否则就是color传入的值
    color = color === undefined ? 'rgb(255, 255, 255)' : color;
    var light = new THREE.SpotLight(color, intensity);//创建聚光灯
    light.castShadow = true;//开启阴影

    //使聚光灯边缘柔化
    light.penumbra = 0.5;//penumbra半影 在三维中专门指聚光灯轮廓的模糊程度

    //设置深度贴图的大小以及偏差值
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    light.shadow.bias = 0.001;

    return light;
}

var scene = Init();