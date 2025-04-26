export const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uBrightness;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    // Calculate fresnel effect (edge glow)
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - dot(viewDirection, vNormal), 3.0);
    
    // Create a pulsing glow effect
    float pulse = sin(uTime * 0.5) * 0.5 + 0.5;
    
    // Combine base color with fresnel and pulse
    vec3 color = mix(uColor, vec3(1.0, 1.0, 1.0), fresnel * 0.7);
    
    // Apply brightness from audio
    color = mix(color, vec3(0.0, 0.5, 1.0), uBrightness * 0.5);
    
    // Add glow based on fresnel
    color += vec3(0.0, 0.3, 0.8) * fresnel * 0.8 * (pulse * 0.3 + 0.7);
    
    gl_FragColor = vec4(color, 0.9);
  }
`;
