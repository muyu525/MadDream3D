/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-11-13 21:04:12
 * @Description: file content
 */
function createCubeUrls(pf,et){
   var envMap = [pf+"posx"+et,pf+"negx"+et,pf+"posy"+et,
   pf+"negy"+et,pf+"posz"+et,pf+"negz"+et
   ];
   return envMap;
}


function __createPBRMat(scene,key){
     // var folder = "../pics/steelplate1/"; //5
     //var folder ="../pics/modern-brick1/";
    //var folder = "../pics/streaked-metal1/";  //10
    // var folder ="../pics/gold/"; //10
     //var folder ="../pics/plastic/"; //5
    //var folder = "../pics/rusted_iron/";
   //var  folder = "../pics/wall/";
   var tf = 0.00;
   var diff = new Mad3D.Vector3(1.0*tf,1.0*tf,1.0*tf);
   var folder = "../pics/"+key+"/";
   var baseUrl = folder+"albedo.png";
   var metalUrl = folder+"metallic.png";
   var roughUrl = folder+"roughness.png";
   var normalUrl = folder +"normal.png";
   var aoUrl = folder+"ao.png"; 
   var heightUrl = folder+"height.png";
   var mat = null;
   if(key === "white"){
         mat = Mad3D.SceneUtil.createMaterial(scene,{receiveLight:true,receiveShadow:false,diffuse:diff,
         PBR:true,
         matColor:[0.93, 0.91, 0.81,1.0],roughness:0.0,metalness:0.0,
          radianceMap:scene.currentEnvMap,
         gammaCorrect:true,hdrExposure:1.0});
   }else{
      // tex.type = TextureType.cube;
      mat = Mad3D.SceneUtil.createMaterial(scene,{receiveLight:true,receiveShadow:false,diffuse:diff,
      PBR:true,
       texture0:baseUrl,metalMap:metalUrl,roughMap:roughUrl,normalMap:normalUrl,
       radianceMap:scene.currentEnvMap,
       gammaCorrect:true,hdrExposure:1.0,aoMap:aoUrl,
       });
   }
   return mat;
}

function getPBRMat(scene,key,matDicts){
   var mat = matDicts[key];
   if( mat=== undefined){
      mat = __createPBRMat(scene,key);
      matDicts[key] = mat;
   }
   return mat;
}

function __createEnvMat(scene,key){
   var mat = null;

   if(key.indexOf(".")>0){
      // textures mat
      mat = Mad3D.SceneUtil.createMaterial(scene,{
         texture0:"../pics/sphericalMap/"+key,receiveLight:false,
         cullFace:"FRONT"
      });
   }else{
      //cube mat
      var spMap = createCubeUrls("../pics/"+key+"/",".hdr");
      mat = Mad3D.SceneUtil.createMaterial(scene,{cubeMap:spMap,receiveLight:false,
         cullFace:"FRONT"});
   }
   return mat;
}

function getEnvMat(scene,key,skyMatDict){
   var mat = skyMatDict[key];
   if( mat=== undefined){
      mat = __createEnvMat(scene,key);
      skyMatDict[key] = mat;
   }
  return mat;
}



function initScene(){
   //step1 default scene
    var ds = Mad3D.SceneUtil.createDefaultScene("sipc",{hasSkyBox:false,castShadow:false,canvasLayout:Mad3D.Layout.UseOwn});
    var w = ds.scene.gl.canvas.width; var h = ds.scene.gl.canvas.height;
    ds.camera.clearColor = [0.0,0.0,0.0,1.0];
    ds.camera.renderMask = Mad3D.RenderMask.layers;
    ds.camera.addRenderLayer(Mad3D.RenderLayer.default);
   
    //step2 light
    ds.scene.ambientLight = new Mad3D.Vector3(0.0,0.0,0.0);
    var lt = ds.dirLight;
    var intes = 0.0;
    lt.color = new Mad3D.Vector3(1.0*intes,1.0*intes,1.0*intes);
    lt.specular = new Mad3D.Vector3(1.0*intes,1.0*intes,1.0*intes);
    var smesh = Mad3D.MeshUtil.createSphere(2.0,100,100,true);

    // step3 : render sphere Hdr to cube
   ds.scene.envMatDict = {};
   //Brooklyn_Bridge.hdr pisaHDR room1.png
   var key = "Brooklyn_Bridge.hdr";
   var envMat = getEnvMat(ds.scene,key,ds.scene.envMatDict);
   var envLayer = Mad3D.RenderLayer.default+2;
   var cubeCam = Mad3D.IBLUtil.createRadianceCamera(envMat,smesh,w,h,envLayer,ds.scene);
   ds.scene.currentEnvMap = cubeCam.renderTarget;
   //var sp2Map = createCubeUrls("../pics/"+key+"/",".hdr");
   //var sp2Map ="../pics/sphericalMap/Brooklyn_Bridge.hdr";
  // ds.scene.currentEnvMap = sp2Map;
   //add sky
  // alert("normal"+ds.scene.gl.getExtension("EXT_texture_filter_anisotropic")+"mozi"+ds.scene.gl.getExtension("MOZ_EXT_texture_filter_anisotropic"));
    var skycube =  Mad3D.MeshUtil.createBox(20,20,20);
   var sky = Mad3D.SceneUtil.createEntity(ds.scene,"sky",
      {mesh:skycube,cubeMap:ds.scene.currentEnvMap,receiveLight:false,
      cullFace:"FRONT",gammaCorrect:true});
  ds.scene.addEntity(sky);
      // var ext = ds.scene.gl.getExtension("EXT_color_buffer_half_float");
      // alert(ext);
   //set CameraOrder
   cubeCam.next =ds.camera;
   ds.camera.enable = false;
   cubeCam.enable = true;

   
   //step5 render object-sphere to main camera
   ds.scene.matDicts = {};
   var mat = getPBRMat(ds.scene,"white",ds.scene.matDicts);
   var enti1 =Mad3D.SceneUtil.createEntity(ds.scene,"sphere",{mesh:smesh,
               material:mat});
   ds.scene.addEntity(enti1);
   enti1.transform.setPosition(-1.3,0,0);
   enti1.transform.resetScale(0.6,0.6,0.6);

   var mat2 = getPBRMat(ds.scene,"gold",ds.scene.matDicts);
   var enti2 =Mad3D.SceneUtil.createEntity(ds.scene,"sphere",{mesh:smesh,
               material:mat2});
   ds.scene.addEntity(enti2);
   enti2.transform.setPosition(1.3,0,0);
   enti2.transform.resetScale(0.6,0.6,0.6);

      
    //interaction
   Mad3D.InteractUtil.registerCameraMove(ds.camera,ds.scene.gl.canvas,function(trans){
       
   });
    
   var tf = enti2.transform;
   var m1 = Mad3D.TransformAni(ds.scene,tf,{
         targets: tf.rot,
         y: 360,
         duration: 20000,
         direction: 'alternate',
         loop: -1,
         easing: 'linear',
         autoplay:true,
         update: function(anim) {
         }
   });

   return ds.scene;
}

function main(){
    scene = initScene();
    //scene.enableActiveDraw(true);
    scene.draw();
}
window.onload = main;


