/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-17 13:03:20
 * @Description: file content
 */

import { AttributeType } from "./Program";

function SingleBufferParam(
    /**@type {WebGLBuffer}*/id,
    elementCount, type, perVertexSize) {
    /**@type {WebGLBuffer} */
    this.id = id;
    /**@type {mode} */
    this.type = type;
    this.elementCount = elementCount;
    this.perVertexSize = perVertexSize; // per iteration for x,y
    this.normalize = false;
    this.stride = 0;
    this.voffset = 0;
}

class VertexBufferInfo {
    constructor() {
        /**@type {SingleBufferParam} */
        this.vertexPos = null;
        /**@type {SingleBufferParam} */
        this.vertexColor = null;
        /**@type {SingleBufferParam} */
        this.vertexIndices = null;
        this.vertexCount = -1;
        this.primitiveType = null;
    }
}
class VertexBuffer {
    static createBufferParam(
        /**@type {WebGLRenderingContext} */gl,
        /**@type {Array}*/Arr,
        elementCount,
        vType,
        bufType) {
        var bufId = gl.createBuffer();
        gl.bindBuffer(bufType, bufId);
        var glArr = null;
        if (vType === gl.FLOAT) {
            glArr = new Float32Array(Arr);

        } else if (vType === gl.UNSIGNED_SHORT) {
            glArr = new Uint16Array(Arr);
        } else {
            console.error("createBufferParam:error:unspported vertex type:", type);
            return null;
        }
        gl.bufferData(bufType, glArr, gl.STATIC_DRAW);
        var vertexNums = Arr.length / elementCount;
        return new SingleBufferParam(bufId, elementCount, vType, vertexNums);
    }

    static addInfoToVB(/**@type {WebGLRenderingContext} */gl,
        /**@type {VertexBufferInfo}*/vBInfo,
        /**@type {Array}*/Arr,
        elementCount,
        /**@type {string}*/key,
        vType, bufType) {
        if (Arr instanceof (Array) || Arr instanceof Uint16Array
            || Arr instanceof Float32Array) {
            AttributeType.types[key] = true;
            vBInfo[key] = VertexBuffer.createBufferParam(gl,
                Arr, elementCount, vType, bufType);
            return true;
        } else {
            console.log("addInfoToVB error: infoName=" + key, " Arr type should be Array not", typeof (Arr));
            return false;
        }

    }

    static addPos(/**@type {WebGLRenderingContext} */gl,
        /**@type {VertexBufferInfo}*/vBInfo,
        /**@type {Array}*/posArr) {
        return VertexBuffer.addInfoToVB(gl, vBInfo,
            posArr, vBInfo.vertexCount, "vertexPos", gl.FLOAT, gl.ARRAY_BUFFER);
    }

    static addColor(/**@type {WebGLRenderingContext} */gl,
         /**@type {VertexBufferInfo}*/vBInfo,
         /**@type {Array}*/colorArr) {
        return VertexBuffer.addInfoToVB(gl, vBInfo,
            colorArr, vBInfo.vertexCount, "vertexColor", gl.FLOAT, gl.ARRAY_BUFFER);

    }

    static addIndices(/**@type {WebGLRenderingContext} */gl,
        /**@type {VertexBufferInfo}*/vBInfo,
         /**@type {Array}*/indicesArr) {
        return VertexBuffer.addInfoToVB(gl, vBInfo,
            indicesArr, indicesArr.length, "vertexIndices", gl.UNSIGNED_SHORT, gl.ELEMENT_ARRAY_BUFFER);
    }


    static initVertexBuffer(
        /**@type {WebGLRenderingContext} */gl,
        vertexCount,
        primitiveType) {
        var vertBuffInfo = new VertexBufferInfo();
        vertBuffInfo.vertexCount = vertexCount;
        if (primitiveType === null) {
            vertBuffInfo.primitiveType = gl.TRIANGLE_STRIP;
        } else {
            vertBuffInfo.primitiveType = primitiveType;
        }
        /**@type {VertexBufferInfo}*/
        return vertBuffInfo;
    }
}


export { VertexBuffer }