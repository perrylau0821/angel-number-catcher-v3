const startDust = `
uniform float time;
uniform vec2 resolution;
uniform vec2 pointer;
uniform vec2 center;

const float period = 15.0;
const mat2 m = mat2(1.6, 0.2, -1.2, 1.6);

vec2 uvd;
float zoom;

// Basic random function
float rnd(float p) {
    p *= 1234.5678;
    p = fract(p * 0.1031);
    p *= p + 33.33;
    return fract(2.0 * p * p);
}

// Helper function to replace the macro system
float getRnd(float seed) {
    float fxtime = floor(time/period);
    float fxrand = fxtime + 123.456; // Replace iDate.z with a constant
    return rnd(fxrand + seed);
}

float hashh(vec2 p) {
    return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x))));
}

float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 x) {
    vec2 i = floor(x);
    vec2 f = fract(x);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(in vec2 p) {
    float value = 0.0;
    float freq = 1.0;
    float amp = 0.5;

    for (int i = 0; i < 14; i++) {
        value += amp * (noise((p - vec2(1.0)) * freq));
        freq *= 1.9;
        amp *= 0.6;
    }
    return value;
}

mat2 rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, s, -s, c);
}

float rand(float r) {
    vec2 co = vec2(cos(r * 428.7895), sin(r * 722.564));
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 render(vec3 dir) {
    float s = 0.3, fade = 1.0, fade2 = 1.0, pa = 0.0, sd = 0.2;
    vec3 v = vec3(0.0);
    dir.y += 4.0 * getRnd(0.333);  // Using hash4
    dir.x += getRnd(0.444);        // Using hash5
    
    for (float r = 0.0; r < 15.0; r++) {
        vec3 p = s * dir;
        mat2 rt = rot(r);
        p.xz *= rt;
        p.xy *= rt;
        p.yz *= rt;
        p = abs(1.0 - mod(p * (getRnd(0.0) * 2.0 + 1.0), 2.0));  // Using hash1
        float pa, a = pa = 0.0;
        
        for (int i = 0; i < 13; i++) {
            if (float(i) > mod(time, period) * 10.0) break;
            p = abs(p) / dot(p, p) - 0.7 - step(0.5, getRnd(0.997)) * 0.1;  // Using hash10
            float l = length(p) * 0.5;
            a += abs(l - pa);
            pa = length(p);
        }
        
        fade *= 0.96;
        sd += 0.5;
        float cv = abs(2.0 - mod(sd, 4.0));
        v += normalize(vec3(cv * 2.0, cv * cv, cv * cv * cv)) * pow(a * 0.02, 2.0) * fade;
        v.rb *= rot(getRnd(0.222) * 3.0);  // Using hash3
        v = abs(v);
        pa = a;
        s += 0.05;
    }
    
    float sta = v.x;
    vec3 roj = vec3(1.5, 1.0, 0.8);
    uvd.x *= sign(getRnd(1.411777) - 0.5);  // Using hash12
    uvd *= rot(radians(360.0 * getRnd(0.777)));  // Using hash8
    uvd.y *= 1.0 + (uvd.x + 0.5) * 1.0;
    v = pow(v, 1.0 - 0.5 * vec3(smoothstep(0.5, 0.0, abs(uvd.y))));
    v += 0.04 / (0.1 + abs(uvd.y * uvd.y)) * roj * min(1.0, time * 0.3);
    float core = smoothstep(0.3, 0.0, length(uvd)) * 1.2 * min(1.0, time * 0.3);
    v += core * roj;
    v = mix(vec3(length(v) * 0.7), v, 0.45);
    float neb = fbm(dir.xy * 15.0) - 0.5;
    uvd.y += neb * 0.3;
    neb = pow(smoothstep(0.8, 0.0, abs(uvd.y)), 2.0) * 0.9;
    v = mix(v * vec3(1.0, 0.9, 1.2), vec3(0.0), max(neb, 0.7 - neb) + core * 0.06 - sta * 0.1);
    return pow(v, vec3(1.05)) * 1.2;
}

vec4 main(vec2 fragCoord) {
    zoom = length(pointer) > 0.0 ? 2.0 : 0.0;
    vec2 uv = fragCoord/resolution.xy - 0.5;
    uv.x *= resolution.x/resolution.y;
    uvd = uv;
    
    vec2 m = pointer/resolution.xy - 0.5;
    m.x *= resolution.x/resolution.y;
    
    float fade = 0.5;
    if (step(0.3, length(uv-m)) < 0.5 && zoom > 0.1) {
        float zo = 0.4/zoom;
        uv -= m;
        uvd -= m;
        uv *= zo;
        uvd *= zo;
        uv += m;
        uvd += m;
        fade = 1.0;
    }
    
    vec3 dir = normalize(vec3(uv, 1.0));
    vec3 col = render(dir);
    return vec4(col, 1.0);
}`;

export default startDust;