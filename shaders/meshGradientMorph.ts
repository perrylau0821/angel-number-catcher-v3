
const meshGradientMorphShader = `
uniform vec2 resolution;
uniform float time;

mat2 Rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(2127.1, 81.17)), dot(p, vec2(1269.5, 283.37)));
    return fract(sin(p)*43758.5453);
}

float noise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    float n = mix(
        mix(dot(-1.0+2.0*hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
            dot(-1.0+2.0*hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
        mix(dot(-1.0+2.0*hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
            dot(-1.0+2.0*hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
        u.y
    );
    return 0.5 + 0.5*n;
}

float filmGrainNoise(in vec2 uv) {
    return length(hash(vec2(uv.x, uv.y)));
}

vec4 main(vec2 pos) {
    vec2 uv = pos/resolution.xy;
    float aspectRatio = resolution.x/resolution.y;
    
    // Transformed uv
    vec2 tuv = uv - 0.5;

    // Rotate with noise
    float degree = noise(vec2(time*0.05, tuv.x*tuv.y));

    tuv.y *= 1.0/aspectRatio;
    tuv *= Rot(radians((degree-0.5)*720.0+180.0));
    tuv.y *= aspectRatio;

    // Wave warp with sine
    float frequency = 5.0;
    float amplitude = 30.0;
    float speed = time * 2.0;
    tuv.x += sin(tuv.y*frequency+speed)/amplitude;
    tuv.y += sin(tuv.x*frequency*1.5+speed)/(amplitude*0.5);
    
    // Light gradient colors
    vec3 amberYellow = vec3(299.0, 186.0, 137.0) / 255.0;
    vec3 deepBlue = vec3(49.0, 98.0, 238.0) / 255.0;
    vec3 pink = vec3(246.0, 146.0, 146.0) / 255.0;
    vec3 blue = vec3(89.0, 181.0, 243.0) / 255.0;
    
    // Dark gradient colors
    vec3 purpleHaze = vec3(105.0, 49.0, 245.0) / 255.0;
    vec3 swampyBlack = vec3(32.0, 42.0, 50.0) / 255.0;
    vec3 persimmonOrange = vec3(233.0, 51.0, 52.0) / 255.0;
    vec3 darkAmber = vec3(233.0, 160.0, 75.0) / 255.0;
    
    // Interpolate between light and dark gradient
    float cycle = sin(time * 0.5);
    float t = (sign(cycle) * pow(abs(cycle), 0.6) + 1.0) / 2.0;
    vec3 color1 = mix(amberYellow, purpleHaze, t);
    vec3 color2 = mix(deepBlue, swampyBlack, t);
    vec3 color3 = mix(pink, persimmonOrange, t);
    vec3 color4 = mix(blue, darkAmber, t);

    // Blend the gradient colors and apply transformations
    vec3 layer1 = mix(color3, color2, smoothstep(-0.3, 0.2, (tuv*Rot(radians(-5.0))).x));
    vec3 layer2 = mix(color4, color1, smoothstep(-0.3, 0.2, (tuv*Rot(radians(-5.0))).x));
    
    vec3 color = mix(layer1, layer2, smoothstep(0.5, -0.3, tuv.y));

    // Apply film grain
    float filmGrainIntensity = 0.05;
    color = color - filmGrainNoise(uv) * filmGrainIntensity;
    
    return vec4(color, 1.0);
}
`
export default meshGradientMorphShader