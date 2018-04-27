
<style>
h4{color:#333;}
input{display:block;width:90%;padding:8px;}
textarea{display:block;width:90%;padding:8px;}
button{padding:10px 20px;cursor:pointer;}
.tiny{font-size:12px;line-height:180%;}
.scale{padding:10px 10px;width:50px;display:inline-block;margin-right:30px;}
</style>
<template>
<div>
   <h4>createjs.Graphics生成工具</h4>
   <p>
      <input v-model="path" placeholder="Svg path元素参数d的值" />
   </p>
   <p>缩放比例: <input v-model="scale" class="scale"><button @click="transform">转换</button></p>
   <p>
     <textarea rows="8" v-model="rest"></textarea>
   </p>
   <p class="tiny">
     1, 用PhotoShop钢笔描好路径后,导出路径到AI.<br />
     2, AI打开文件,在菜单栏[对象->画板->适合图稿边界].然后菜单栏[文件->脚本->将文档储存为SVG<br />
	 3, 文本编辑器打开SVG文件,拷贝路径元素的D参数来转换<br />
	 4, 测试字符串
	 <textarea rows="6">M25.68,24.86c0,0-24.268-5.737-25.68,19.68
	C0.385,56.1,4.365,58.382,13.68,65.661c1.867,1.458,4.133,2.44,6.48,3.84c2.194,1.308,4.461,3.018,6.48,4.8
	c5.18,4.573,9.087,10.568,9.6,11.76c0,0,3.643-6.853,10.8-13.2c3.085-2.736,7.039-4.983,11.28-7.2c0,0,15.28,20.08,15.12,20.88
	c-0.102,0.51,4.404-9.084,13.2-17.76c3.082-3.04,7.106-5.496,11.28-7.92c2.6-1.51,4.646-3.296,7.44-4.32
	c3.186-2.08,18.951-12.56,15.6-32.4c0,0-6.986-27.163-29.04-23.52c-10.537,1.74-12.762,5.31-18.48,12.24
	c1.098-0.934-20.03-26.133-41.28-3.36C28.716,13.191,27.061,18.437,25.68,24.86z
	</textarea>
   </p>
   <canvas id="canvas" width="800" height="400"></canvas>
</div>
</template>
<script>

export default {
  data(){
     return {
	     path:'',
		 rest:'',
		 scale:1,
		 stage:null
	 };
  },
  methods:{
      transform(){
	     if(!this.path) return;
	     var rest  = new this.svgpath(this.path).abs().unshort().unarc().scale(this.scale).round();
		 rest.iterate(function(seg,index){
		    if(seg.length<2){
			   return ;
			}
			if(seg.length==2){
			   var x,y,last = rest.segments[index-1];
			   if(last.length===3){
			       x = last[1];
				   y = last[2];
			   }else{ 
			   	   x = last[5];
				   y = last[6];
			   }
			   if(seg[0]=='V'){
			      rest.segments[index]= ['L',x,seg[1]];
			   }else{
			      rest.segments[index]=  ['L',seg[1],y];
			   }
			}
		 });
		 var txt = 'var graphics = new createjs.Graphics()';
		 var pic = new createjs.Graphics();
		 rest.segments.forEach(function(v){
		    switch(v[0]){
			    case 'M':
				  txt +='.'+'mt('+v[1]+','+v[2]+')';
				  pic.mt(v[1],v[2]);
				break;
				case 'L':
				  txt +='.'+'lt('+v[1]+','+v[2]+')';
				  pic.lt(v[1],v[2]);
				break;
				case 'C':
				  txt +='.'+'bezierCurveTo('+v[1]+','+v[2]+','+v[3]+','+v[4]+','+v[5]+','+v[6]+')';
				  pic.bezierCurveTo(v[1],v[2],v[3],v[4],v[5],v[6]);
				break;
			}
		 });
		 this.rest  = txt+';';
		 this.stage.removeAllChildren();
		 this.stage.update();
		 var shape = new createjs.Shape(pic);
	     shape.graphics.append(new createjs.Graphics.Fill('rgba(255,0,0,1)'));	
	     this.stage.addChild(shape);
		 this.stage.update();
		 console.log(this.stage);
	  }
  },
  mounted(){
	  this.stage = new createjs.Stage("canvas");
  }
}
</script>