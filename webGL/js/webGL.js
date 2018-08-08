var scene = new THREE.Scene();//新场景
var aspect = window.innerWidth / window.innerHeight;//宽高比
var camera = new THREE.PerspectiveCamera( 75,aspect,0.1, 5000 );
//THREE.PerspectiveCamera( fov, aspect, near, far ) fov表示摄像机的视角范围，后两个参数far表示摄像机视野范围（真实可见部分）0.1到1000
var renderer = new THREE.WebGLRenderer({antialias:true});
var loader = new THREE.TextureLoader();
var textureMoon = loader.load("images/moon.jpg");
var controls , container,stats;
var geometry = new THREE.SphereGeometry(1,128,96);//长宽高
camera.position.z = 5;//相机远近


container = document.getElementById( 'WebGL-output' );
container.appendChild( renderer.domElement );
/*renderer的domElement元素，表示渲染器中的画布，所有的渲染都是画在domElement上的
，所以这里的appendChild表示将这个domElement挂接在id=WebGL-output的div下面，
这样渲染的结果就能够在页面中显示了。*/

//再设置相机控件，这行代码能让我们360°的旋转相机
controls = new THREE.OrbitControls( camera, renderer.domElement );

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


//*********************材质类*************************
var materialKind = {
       Moon : new THREE.MeshPhongMaterial({
                            color:0xFFFFF0,
                            specular: 0xFFFFF0,
                            shininess: 15,
                            map: loader.load("images/moon_1024.jpg"),
                            specularMap: loader.load("images/moon_1024.jpg"),
                            normalMap: loader.load("images/moon_1024.jpg")
                            }),
       Sun : new THREE.MeshPhongMaterial({
                            color:0xFFD700,
                            specular: 0xFFD700,
                            shininess: 5,
                            map: loader.load("images/sun.jpg"),
                            specularMap: loader.load("images/lavatile.jpg"),
                            normalMap: loader.load("images/lavatile.jpg")
                            }),
       Earth : new THREE.MeshPhongMaterial({
                            color: 0xb0b0F0,
                            specular: 0xb0b0F0,
                            shininess: 15,
                            map: loader.load("images/earth.jpg"),
                            specularMap: loader.load("images/earth_specular_2048.jpg"),
                            normalMap: loader.load("images/earth_normal_2048.jpg")
                             })
};
//*********************材质类*************************

//*********************灯光类*************************
var light = {
    light0 : new THREE.AmbientLight(
                            0xffffff,
                            angle = Math.PI/2,//光的范围
                            penumbra = 1//0无光阴圈
                            ),//颜色，强度
    light1 : new THREE.PointLight(
                            0xffffff,
                            angle = Math.PI/2,//光的范围
                            penumbra = 1,//0无光阴圈
                            1000
                            ),//颜色，强度
};
//*********************灯光类*************************

//*********************基础物体类*************************
var mesh = {
    Earth : new THREE.Mesh(
                          geometry,
                          materialKind.Earth
                          ),//地球
    Sun : new THREE.Mesh(
                          geometry,
                          materialKind.Sun
                         ),
    Moon : new THREE.Mesh(
                          geometry,
                          materialKind.Moon
                          )
};
//*********************基础物体类*************************


//*********************函数区域*************************

 //*********************显示帧率函数*************************
// (function(){
//     var script=document.createElement('script');//添加script标签
//     script.onload=function(){//当脚本加载时运行
//         var stats=new Stats();
//         document.body.appendChild(stats.dom);//添加到body标签中
//         requestAnimationFrame(function loop(){//添加刷新函数
//             stats.update();//调用实时刷新
//             requestAnimationFrame(loop)//递归调用实现刷新
//         });
//     };
//     script.src='https://cdn.bootcss.com/stats.js/16/Stats.js';//script标签加入src
//     document.head.appendChild(script);//script标签添加到头部
//
// })()//闭包编写，这样对其他代码的影响是最少的
// (function () {
//     stats = new Stats();
//     stats.setMode(0);
//     stats.domElement.position= 'absolute';
//     stats.domElement.left = '0px';
//     stats.domElement.top = '0px';
//     document.body.appendChild(stats.domElement);
// })();
 //*********************显示帧率函数*************************

//绕点旋转函数
function changePivot(x,y,z,obj){//改函数可以定义物体旋转中心
    let wrapper = new THREE.Object3D();
    wrapper.position.set(x,y,z);
    wrapper.add(obj);
    return wrapper;
}

//天空盒函数
function createSkyBox() {
    var path = "images/";//路径
    var directions  = ["dark-s_px", "dark-s_nx", "dark-s_py", "dark-s_ny", "dark-s_pz", "dark-s_nz"];//获取对象
    var format = ".jpg";//格式
    //创建盒子，并设置盒子的大小为( 5000, 5000, 5000 )
    var skyGeometry = new THREE.BoxGeometry( 1000, 1000, 1000 );
    //设置盒子材质
    var materialArray = [];
    for (var i = 0; i < 6; i++)
        materialArray.push( new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture( path + directions[i] + format ),//将图片纹理贴上
            side: THREE.BackSide/*镜像翻转，如果设置镜像翻转，那么只会看到黑漆漆的一片，因为你身处在盒子的内部，所以一定要设置镜像翻转。*/
        }));
    var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
    var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );//创建一个完整的天空盒，填入几何模型和材质的参数
    scene.add( skyBox );//在场景中加入天空盒
}

//创建一个圆球组成的环，暂时用不上
var cubeGroup = function () {
    let count = 0,Ri=3;//环绕的半径
    let groupObj = new THREE.Group();
    for(var i = 0;i<16;i++){
        count += i*(Math.PI/8);
        var cubeTemp = new THREE.Mesh(geometry,materialKind.Moon );//静态物体实例
        cubeTemp.position.x = Ri*Math.cos(count);
        cubeTemp.position.z = Ri*Math.sin(count);
        cubeTemp.position.y = 0;
        cubeTemp.scale.set(0.2,0.2,0.2);//括缩
        groupObj.add(cubeTemp);
    }
    return groupObj;
}

//*********************函数区域*************************

var mySun = new THREE.Mesh(geometry,materialKind.Sun);//太阳
var myMoon = new THREE.Mesh(geometry,materialKind.Moon)//月
var earth = new THREE.Mesh(geometry, materialKind.Earth,);//地球
var EMsystem = changePivot(5,0,-1,myMoon)//调用函数定义旋转中心
//var SunSystem = changePivot(-80,0,0,EMsystem)//调用函数定义旋转中心

//*********************参数设置*************************
    earth.position.set(5,0,-1);
    myMoon.position.set(6,0,-1);
    mySun.position.set(-100,0,0);
    earth.scale.set(1,1,1)//括缩
    mySun.scale.set(80,80,80);
    myMoon.scale.set(0.2,0.2,0.2);
    createSkyBox();//星空背景
    scene.add(earth);
    //scene.add(SunSystem);
    scene.add(EMsystem);
    scene.add(mySun);
    //scene.add(group);
    scene.add(light.light0);
//*********************参数设置*************************

var render = function () {//渲染函数

    earth.rotation.y += 0.01;//地球旋转参数
    mySun.rotation.y += 0.001;//太阳旋转参数
    myMoon.rotation.y += 0.1;//月球旋转参数
    EMsystem.rotation.y += 0.01;//地月旋转参数

    renderer.render( scene, camera );//摄像机
    //stats.update();
    controls.update();
    requestAnimationFrame( render );//递归函数，一直调用自身
};
render();