//给数组扩展查找方法
Array.prototype.findThing = function(n){
	for(var i=0; i<this.length; i++){
		if(this[i] === n){
			return true;
		};
	};
	return false;
};

//获取当前时间
Date.prototype.getTimeNow = function (){

	var year = this.getFullYear();
	var month = this.getMonth() + 1;
	var day = this.getDate();
	var hours = this.getHours();
	var min = this.getMinutes();

	return year + '年' + month + '月' + day + '日' + hours + '时' + min + '分';
};

Array.prototype.findInJson = function (attr, value){

	for(var i=0; i<this.length; i++){
		this[i][attr] = this[i][attr].toLowerCase();
		if(this[i][attr] == value){
			return true;
		};
	};

	return false;
};