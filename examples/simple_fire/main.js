/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-15 19:55:30
 * @Description: file content
 */


function initCanvas(canvasId){
    
     // init Canvas
     var canvas = document.getElementById(canvasId);
    // canvas.width = canvas.clientWidth;
     //canvas.height = canvas.clientHeight;
     canvas.addEventListener("touchmove",responseToMouse,false);
     /** @type {WebGLRenderingContext} */
     var gl = canvas.getContext("webgl");
     if (gl === null){
         gl = canvas.getContext("experimental-webgl");
     }
     if (gl === null){
         alert("Unable to initialize the webgl context");
     }
     /** @type {WebGLRenderingContext} */
     return  gl;    
}
function responseToMouse(
    /**@type {TouchEvent} */
    ev){
        //console.log("move");
        var tc = ev.touches[0];
        var x = tc.clientX/window.clientWidth;
        var y = tc.clientY/window.clientHeight;
        mdg.mat.setUniform("u_mouse",Mad3D.UTypeEnumn.Vec2,[x,y]);
        //mdg.scene.requireUpdate();
        //scene.require
       // console.log(x,y);


}

function initCamera(asp){
    console.log("camera,asp:",asp);
    var cam = new Mad3D.Camera();
    /**@type {Transform} */
    var transform  = cam.transform;
    cam.setFov(45);
    cam.setFar(100.0);
    cam.setNear(0.1);
    cam.setAsp(asp);
    transform.setPosition(0,0,6);
    //transform.rotate(0,0,0);
    return cam;
}
var mdg = {};

function addTexs(mat,texsArr){
    for(var i=0;i<texsArr.length;i++){
        var tex = Mad3D.MaterialUtil.createTextureFromOps(texsArr[i]);
        if(i===0||i===1){
            tex.wrap_mode = Mad3D.TextureWrap.repeat;
        }
        
        mat.setUniform("texture"+i,Mad3D.UTypeEnumn.texture,tex);
        mat.addTexture(tex);
    }
    
    mat.shaderOption.useUV = true;
}

function initScene(){
    /**@type {WebGLRenderingContext} */
    var gl = initCanvas("sipc");
    //gl.enable(gl.CULL_FACE);
    //gl.cullFace(gl.FRONT);
    // set projection and mv matrix
    var w = gl.canvas.clientWidth;
    var h = gl.canvas.clientHeight;
    var asp  = w/h;
    var cam = initCamera(asp);
    // create Mesh:
    //var mesh =createSqModelMesh();
    //var mesh = MeshUtil.createColorBox();
    var mesh = Mad3D.MeshUtil.createPlane(3,3,2.0);
 // var mesh =  MeshUtil.createCameraPlane(cam);
    /**@type {Material} */
    var material = Mad3D.MaterialUtil.createFromShader(vsSource,fsSource);
    material.setUniform("u_mouse",Mad3D.UTypeEnumn.Vec2,[0.0,1.0]);
    var path = "../pics/fire_simple/";
    addTexs(material,[path+"fire01.jpg",path+"noise01.jpg",path+"alpha01.jpg"]);
    //console.log("resolution",w,h);
   // material.setUniform("u_resolution",UTypeEnumn.Vec2,[w,h]);
    mdg.mat = material;
    //var ets = [];
    var entity = new Mad3D.Entity("t1");
    entity.mesh = mesh;
    entity.material = material;
    //entity.transform.setPosition(0,0,6);
    //entity.transform.copyFrom(cam.transform);
    //entity.transform.translate(0,0,0);
    //var ets = createSineBoxes(entity);
    // test anim
    
    var ets = [];
    ets.push(entity);

    var scene = new Mad3D.Scene();
    mdg.scene = scene;
    //scene.clearColor = [0.2,0.3,0.4,1.0];
    scene.addCamera(cam);
    cam.clearColor = [0.0,0.0,0.0,1.0];
    scene.entityList = ets;
    scene.gl = gl;
    var p2 = {utime:1000.0};
    var m2 = Mad3D.ValueAni(
    {
        targets: p2,
        utime:1.0,
        duration: 2000000,
        loop: 100,
        easing: 'linear',
        autoplay:true,
        update: function(anim) {
           // console.log(p2.utime);
            material.setUniform("utime",Mad3D.UTypeEnumn.float,p2.utime);
        }
    });
    return scene;
}

 function main(){
    scene = initScene();
   // scene.enableActiveDraw(true);
    scene.draw();
    
}


window.onload = main;



