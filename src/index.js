import Vue from 'vue';
import svgpath from 'svgpath';
import app from './app.vue';

Vue.prototype.svgpath = svgpath;
new Vue({
	el:'#app',
	render:(h)=>h(app)
});