export const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uBrightness;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // Function to create a soft glow effect
  float softGlow(float value, float intensity) {
    return pow(value, 2.0) * intensity;
  }

  void main() {
    // Calculate fresnel effect (edge glow)
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - dot(viewDirection, vNormal), 7.0); // Sharpened fresnel effect

    // Create a pulsing glow effect
    float pulse = sin(uTime * 0.5) * 0.5 + 0.5;

    // Enhanced color palette with richer blues and darker core
    vec3 deepBlue = vec3(0.0, 0.05, 0.2); // Dark blue for the core
    vec3 brightBlue = vec3(0.0, 0.6, 1.0); // Bright blue for the edges
    vec3 glowColor = vec3(0.2, 0.5, 1.0);  // Outer glow color

    // Create a gradient from deep blue to bright blue based on fresnel
    vec3 baseColor = mix(deepBlue, brightBlue, fresnel * 0.9);

    // Apply brightness from audio with enhanced contrast
    float enhancedBrightness = uBrightness * 1.2; // Increase brightness influence
    baseColor = mix(baseColor, brightBlue, enhancedBrightness * 0.6);

    // Add inner glow based on audio reactivity
    baseColor += glowColor * softGlow(uBrightness, 0.2); // Reduced inner glow

    // Add outer glow based on fresnel with increased intensity
    float outerGlowIntensity = 1.2 * (pulse * 0.3 + 0.7);
    vec3 outerGlow = glowColor * softGlow(fresnel, outerGlowIntensity);
    baseColor += outerGlow;

    // Add subtle rim light for better definition
    float rimLight = pow(fresnel, 2.0) * 0.5;
    baseColor += vec3(0.5, 0.7, 1.0) * rimLight;

    // Apply subsurface scattering simulation
    float sss = pow(max(0.0, dot(viewDirection, -normalize(vNormal))), 2.0) * 0.2;
    baseColor += brightBlue * (sss * 0.5); // Reduced SSS contribution

    // Final color with slight transparency for the glow effect
    gl_FragColor = vec4(baseColor, 0.92);
  }
`;
