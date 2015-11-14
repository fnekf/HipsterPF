/**
 *
 * Hipster Photo Filter
 * Ported from Hipster photo filter by unc http://vvvv.org/documentation/lomograph-(ex9.texture-filter)/ 
 *
 */

THREE.HipsterPF = {

	uniforms: {
	"tDiffuse": { type: "t", value: null },
  	"R":{type: "v2",value:new THREE.Vector2(500.0,500.0)}, //Texture Size
    "Start":{type: "f",value:0.0 }, // Vignette Start
    "Amount":{type: "f",value:0.5 }, // Vignette Amount
    "Dodge":{type: "f",value:1.0 }, //Vignette Dodge
    "Color":{type: "f",value:0.5 },
    "Contrast":{type: "f",value:0.5 },
    "Level":{type: "f",value:1.0 },
    "Effect":{type: "f",value:1.0 }, //amount of effect (Dry/Wet)
    "Type":{type: "i",value:0 }, // Value between 0 and 7
    "Iterations":{type: "i",value:4 } // Value between 1 and 20
	},

	vertexShader: [

		"varying vec2 mUv;",
		"varying vec3 mPos;",
		"uniform vec2 R;",

		"void main() {",

			"mUv = uv;",
			//"mUv+=0.5/R;",
			"mPos = position;",
			//"mPos.xy*=2.0;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform float Start;",
		"uniform float Amount;",
		"uniform float Dodge;",
		"uniform float Color;",
		"uniform float Contrast;",
		"uniform float Level;",
		"uniform float Effect;",
		"uniform int Type;",
		"uniform vec2 R;",
		"uniform int Iterations;",
		"varying vec2 mUv;",
		"varying vec3 mPos;",
		
"vec3 EffectShape1(vec3 x,float effect){",
	"vec4 B=vec4(0.49,-1.04,1.24,0.24);",
	"vec4 G=vec4(-0.64,0.56,0.98,0.09);",
	"vec4 R=vec4(-0.42,0.83,0.5,0.09);",
	"x.r=mix(x,x*x*x*R.x+x*x*R.y+x*R.z+R.w,effect).r;",
	"x.g=mix(x,x*x*x*G.x+x*x*G.y+x*G.z+G.w,effect).g;",
	"x.b=mix(x,max(vec3(0.24),x*x*x*B.x+x*x*B.y+x*B.z+B.w),effect).b;",
	"return x;",
"}",
"vec3 EffectShape2(vec3 x,float effect){",
	"vec4 B=vec4(0.1,-0.38,0.98,0.23);",
	"vec4 G=vec4(-1.47,1.92,0.44,0.11);",
	"vec4 R=vec4(-1.17,2.46,-0.1,0.11);",
	"effect*=4.0/5.0;",
	"x.r=mix(x,x*x*x*R.x+x*x*R.y+x*R.z+R.w,effect).r;",
	"x.g=mix(x,x*x*x*G.x+x*x*G.y+x*G.z+G.w,effect).g;",
	"x.b=mix(x,x*x*x*B.x+x*x*B.y+x*B.z+B.w,effect).b;",
	"return x;",
"}",
"vec3 EffectShape3(vec3 x,float effect){",
	"vec4 B=vec4(-0.84,0.94,0.6,0.04);",
	"vec4 G=vec4(-0.84,1.14,0.6,0.0);",
	"vec4 R=vec4(4.07,-1.31,0.0,-1.76);",
	"effect*=4.0/5.0;",
	"x.r=mix(x,x*x*x*R.x+x*x*R.y+x*R.z+R.w*x*x*x*x*x,effect).r;",
	"x.g=mix(x,x*x*x*G.x+x*x*G.y+x*G.z+G.w,effect).g;",
	"x.b=mix(x,x*x*x*B.x+x*x*B.y+x*B.z+B.w*x*x*x*x*x,effect).b;",
	"return x;",
"}",

"vec3 EffectShape4(vec3 x,float effect){",
	"vec4 B=vec4(0.0,0.0,0.81,0.09);",
	"vec4 G=vec4(-1.76,2.58,0.17,0.0);",
	"vec4 R=vec4(-0.53,2.24,-0.21,0.0);",
	"effect*=4.0/5.0;",
	"x.r=mix(x,min(1.3-x*0.3,x*x*x*R.x+x*x*R.y+x*R.z+R.w),effect).r;",
	"x.g=mix(x,x*x*x*G.x+x*x*G.y+x*G.z+G.w,effect).g;",
	"x.b=mix(x,max(vec3(0.09),x*x*x*B.x+x*x*B.y+x*B.z+B.w),effect).b;",
	"return x;",
"}",
"vec3 EffectShape5(vec3 x,float effect){",
	"vec4 B=vec4(0.0,0.0,1.5,-0.28);",
	"vec4 G=vec4(0.01,0.0,1.03,-0.02);",
	"vec4 R=vec4(0.0,0.0,0.77,0.1);",
	"effect*=4.0/5.0;",
	"x.r=mix(x,x*x*x*R.x+x*x*R.y+x*R.z+R.w,effect).r;",
	"x.g=mix(x,x*x*x*G.x+x*x*G.y+x*G.z+G.w,effect).g;",
	"x.b=mix(x,max(-0.3*x,x*x*x*B.x+x*x*B.y+x*B.z+B.w),effect).b;",
	"return x;",
"}",

"vec3 EffectShapeSEPIA(vec3 x,float effect){",
	"vec4 B=vec4(-0.31,0.33,0.8,0.11);",
	"vec4 G=vec4(-2.53,3.0,0.03,0.02);",
	"vec4 R=vec4(-1.24,2.08,.14,.11);",
	"x.r=mix(x,min(0.66+x*0.32,x*x*x*R.x+x*x*R.y+x*R.z+R.w),effect).r;",
	"x.g=mix(x,min(0.43+x*0.53,x*x*x*G.x+x*x*G.y+x*G.z+G.w+x*x*x*x*x*0.47),effect).g;",
	"x.b=max(0.1*effect,mix(x,x*x*x*B.x+x*x*B.y+x*B.z+B.w,effect).b);",
	"return x;",
"}",
"vec3 EffectShapeE6C41(vec3 x,float effect){",
//		x=mix(mix(x,max(x.x,max(x.y,x.z)),0.1),min(x.x,min(x.y,x.z)),0.1);

		"x=mix(mix(x,max(vec3(x.x),vec3(max(x.y,x.z))),0.1),min(vec3(x.x),vec3(min(x.y,x.z))),0.1);",


//	"x=mix(mix(x,vec3(max(x.x,max(x.y,x.z))),0.1),vec3(min(x.x,min(x.y,x.z))),0.1);",
	"vec3 y=x;",
	"vec4 B=vec4(-0.18,0.96,-0.96,1.0);",
	"vec4 G=vec4(0.55,-1.83,-0.61,2.77);",
	"vec4 R=vec4(0.23,-0.74,0.52,-0.01);",
	"x.g=mix(x,x*0.11+x*x*G.w+x*x*x*G.z+x*x*x*x*G.y+x*x*x*x*x*x*x*G.x,effect).g;",
	"x.r=mix(x,atan(x*5.0-2.9)/2.0+0.5+x*R.w+x*x*R.z+x*x*x*R.y+x*x*x*x*x*x*R.x,effect).r;",
	"x.b=mix(x,atan(x*13.0-2.2)/10.0+0.09+x*B.w+x*x*B.z+x*x*x*B.y+x*x*x*x*x*x*B.x,effect).b;",
	"return x;",
"}",

"vec3 EffectShapeBW(vec3 x,float effect){",
	//	"x=dot(x.xyz,normalize(vec3(0.36,0.36,0.28))/vec3(sqrt(3.0),sqrt(3.0),sqrt(3.0)));",
	"x=vec3(dot(x.xyz,normalize(vec3(0.36,0.36,0.28))/vec3(sqrt(3.0))));",
	"return x;",
	"}",
"vec3 Vignette(vec3 x,float glow,float amount,float start,float dodge){",
	"start*=0.6;",
	"float Sglow=max(0.0,glow-start)/(1.0-start);",
	"float Dglow=start-glow;",
	"x=x*(1.0-(1.3-pow(x.rgb,vec3(2.0)))*pow(Sglow*2.0,1.5)*0.6*amount);",
	"x*=1.0+pow(max(0.0,Dglow)*2.0,2.0)*(x*5.0-x*x*10.0+5.0*x*x*x)*2.0*dodge*pow(1.34-start,2.0);",
	"return x;",
"}",
"vec3 ColorLevel(vec3 x,float level){",
	"vec4 k0=vec4(0.27,0.11,0.455,-0.006);",
	"vec4 k1=vec4(-0.6,-0.13,1.69,0.00);",
	"x=mix(min(x*x*x*k0.x+x*x*k0.y+x*k0.z+k0.w,0.84),x,clamp(level*2.0,0.0,1.0));",
	"x=mix(x,min(x*x*x*k1.x+x*x*k1.y+x*k1.z+k1.w+x*x*x*x*x*0.07,1.02),clamp(level*2.0-1.0,0.0,1.0));",
	"return x;",
"}",
"vec3 ColorShape(vec3 x,float color){",
	"x+=(color-0.5)*vec3(0.0,0.08,-0.24);",
	"return x;",
"}",
"vec3 ColorContrast(vec3 x,float contrast){",
	"vec4 k0=vec4(-1.24,1.84,0.4,0.0);",
	"x=mix(x,x*x*x*k0.x+x*x*k0.y+x*k0.z+k0.w,contrast*(1.0+(0.6-pow(abs(x-0.5),vec3(0.5)))));",
	"return x;",
"}",
"vec3 sat(vec3 c){",
	"c.rgb+=dot(c.rgb,vec3(0.3));",
	"return c;",
"}",
"float vstep(float a,float b,float x){",
	"x=clamp((x-a)/(b-a),0.0,1.0);",
	"x+=smoothstep(0.8,1.0,x)*0.2;",
	"return x;",
"}",

"vec4 prepass(vec2 x){",
	"vec4 col = texture2D(tDiffuse,mUv);",
	"vec3 z=col.rgb;",
	"for(int i=0;i<20;i++){",
	"if(i < int(Iterations)){",
	"z=ColorShape(z,Color);",
	"z=Vignette(z,length((x-0.5)*R/R.x),Amount,Start,Dodge);",
	"z=ColorContrast(z,Contrast);",
	"z=ColorLevel(z,Level);	",
	"}",
	"else",
		"break;",
	"}",
	"col.rgb=z;",
	"return col;",
"}",



		"void main() {",
		//"vec2 x=(mPos.xy+0.5)/R;",
		"vec2 x=mUv;",
		"vec4 c=prepass(x);",
		"int result=int(min(float(Type),8.0));",
	"if(result==0)",
		"c.rgb=EffectShape1(c.rgb,Effect);",
	"if(result==1)",
		"c.rgb=EffectShape2(c.rgb,Effect);",
	"if(result==2)",
		"c.rgb=EffectShape3(c.rgb,Effect);",
	"if(result==3)",
		"c.rgb=EffectShape4(c.rgb,Effect);",
	"if(result==4)",
		"c.rgb=EffectShape5(c.rgb,Effect);",
	"if(result==5)",
		"c.rgb=EffectShapeE6C41(c.rgb,Effect);",
	"if(result==6)",
		"c.rgb=EffectShapeBW(c.rgb,Effect);",
	"if(result==7)",
		"c.rgb=EffectShapeSEPIA(c.rgb,Effect);",

		"gl_FragColor = vec4(c.rgb,1.0);",
		"}"

	].join("\n")

};


