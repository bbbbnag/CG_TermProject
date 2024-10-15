import { Fn, vec2, vec3, vec4 } from '../tsl/TSLBase.js';
import { WebGPUCoordinateSystem } from '../../constants.js';

/**
* Computes a position in view space based on a fragment's screen position expressed as uv coordinates, the fragments
* depth value and the camera's inverse projection matrix.
*
* @param {vec2} screenPosition - The fragment's screen position expressed as uv coordinates.
* @param {float} depth - The fragment's depth value.
* @param {mat4} projectionMatrixInverse - The camera's inverse projection matrix.
* @return {vec3} The fragments position in view space.
*/
export const getViewPosition = /*@__PURE__*/ Fn( ( [ screenPosition, depth, projectionMatrixInverse ], builder ) => {

	let clipSpacePosition;

	if ( builder.renderer.coordinateSystem === WebGPUCoordinateSystem ) {

		screenPosition = vec2( screenPosition.x, screenPosition.y.oneMinus() ).mul( 2.0 ).sub( 1.0 );
		clipSpacePosition = vec4( vec3( screenPosition, depth ), 1.0 );

	} else {

		clipSpacePosition = vec4( vec3( screenPosition.x, screenPosition.y.oneMinus(), depth ).mul( 2.0 ).sub( 1.0 ), 1.0 );

	}

	const viewSpacePosition = vec4( projectionMatrixInverse.mul( clipSpacePosition ) );

	return viewSpacePosition.xyz.div( viewSpacePosition.w );

} );

/**
* Computes a screen position expressed as uv coordinates based on a fragment's position in view space
* and the camera's projection matrix
*
* @param {vec3} viewPosition - The fragments position in view space.
* @param {mat4} projectionMatrix - The camera's projection matrix.
* @return {vec2} Teh fragment's screen position expressed as uv coordinates.
*/
export const getScreenPosition = /*@__PURE__*/ Fn( ( [ viewPosition, projectionMatrix ] ) => {

	const sampleClipPos = projectionMatrix.mul( vec4( viewPosition, 1.0 ) );
	const sampleUv = sampleClipPos.xy.div( sampleClipPos.w ).mul( 0.5 ).add( 0.5 ).toVar();
	return vec2( sampleUv.x, sampleUv.y.oneMinus() );

} );