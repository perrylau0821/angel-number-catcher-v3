const meshGradient2 = `
uniform float time;
uniform vec2 resolution;

float uSpeakingState = 0.0;

vec2 hash(vec2 p) {
    p = vec2(dot(p,vec2(2127.1,81.17)), dot(p,vec2(1269.5,283.37)));
    return fract(sin(p)*43758.5453);
}

mat2 Rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

float noise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    
    vec2 u = f*f*(3.0-2.0*f);
    float n = mix(mix(dot(-1.0+2.0*hash(i + vec2(0.0,0.0)), f - vec2(0.0,0.0)), 
                      dot(-1.0+2.0*hash(i + vec2(1.0,0.0)), f - vec2(1.0,0.0)), u.x),
                  mix(dot(-1.0+2.0*hash(i + vec2(0.0,1.0)), f - vec2(0.0,1.0)), 
                      dot(-1.0+2.0*hash(i + vec2(1.0,1.0)), f - vec2(1.0,1.0)), u.x), u.y);
    return 0.5 + 0.5*n;
}

float S(float a, float b, float t) {
    return smoothstep(a, b, t);
}

vec4 main(vec2 pos) {
    // 基础UV坐标 [0,1]
    vec2 uv = pos/resolution.xy;
    
    // 处理宽高比
    float ratio = resolution.x / resolution.y;
    
    // 将坐标原点移到中心 [-0.5,0.5]
    vec2 tuv = uv - 0.5;
    
    // 用噪声控制旋转
    float degree = noise(vec2(time*.1, tuv.x*tuv.y));
    tuv.y *= 1./ratio;
    tuv *= Rot(radians((degree-.25)*720.+180.));
    tuv.y *= ratio;
    
    // 定义idle和speaking状态的参数
    float idleFreq = 8.0;
    float speakingFreq = 8.0;
    float idleAmp = 100.0;
    float speakingAmp = 40.0;  // speaking时振幅稍小但频率更高
    float idleSpeed = 1.0;
    float speakingSpeed = 2.5;
    float idleNoise = 0.1;
    float speakingNoise = 0.12;
    
    // 根据状态插值计算实际参数
    float frequency = mix(idleFreq, speakingFreq, uSpeakingState);
    float amplitude = mix(idleAmp, speakingAmp, uSpeakingState);
    float speed = mix(idleSpeed, speakingSpeed, uSpeakingState);
    float noiseAmount = mix(idleNoise, speakingNoise, uSpeakingState);
    
    // 添加波浪变形
    float t = time * speed;
    tuv.x += sin(tuv.y*frequency+t)/amplitude;
    tuv.y += sin(tuv.x*frequency*1.5+t)/(amplitude*.5);
    
    // 添加细微噪声扰动
    float noiseScale = 10.0;
    tuv += (noise(tuv * noiseScale + t) - 0.5) * noiseAmount;
    
    // 颜色混合
    vec3 colorYellow = vec3(1.0, 0.95, 0.8);
    vec3 colorPink = vec3(0.95, 0.6, 0.7);
    vec3 colorBlue = vec3(0.4, 0.5, 0.9);
    
    vec3 layer1 = mix(colorYellow, colorPink, S(-0.2, 0.3, tuv.x));
    layer1 = mix(layer1, colorBlue, S(0.2, 0.6, tuv.y));
    
    return vec4(layer1, 1.0);
}`;

export default meshGradient2;