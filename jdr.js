
function jDR(div, translate, editable){
	function isObject(o) { return Object.prototype.toString.call(o) == '[object Object]'; }
	function isArray(o) { return Object.prototype.toString.call(o) == '[object Array]'; }
	function isBoolean(o) { return Object.prototype.toString.call(o) == '[object Boolean]'; }
	function isNumber(o) { return Object.prototype.toString.call(o) == '[object Number]'; }
	function isString(o) { return Object.prototype.toString.call(o) == '[object String]'; }
	function object_translate(template, translate){
		if(!translate){
			return template;
		}
		var json = {}
		for(var k in translate){
			if(isObject(template[k])){
				json[translate[k].title] = object_translate(template[k], translate[k].data);
			}
			else if(isArray(template[k])){
				var adata = []
				for(var i in template[k]){
					adata.push(object_translate(template[k][i], translate[k].data));									
				}
				json[translate[k].title] = adata;
			}
			else {
				json[translate[k]] = template[k];				
			}
		}
		return json;
	}
	function object_reverse_translate(data, translate){
		if(!translate){
			return data;
		}
		var rdata = {}
		for(var k in data){
			var rky = k;
			for(var rk in translate){
				if(isObject(translate[rk]) && k == translate[rk].title){
					rky = rk;
					break;					
				}
				if (k == translate[rk]){
					rky = rk;
					break;
				}
			}
			//////////////////////////////////////////////////////////////////////////////////				
			if(isObject(data[k])){				
				rdata[rky] = object_reverse_translate(data[k], translate[rky].data);
			}
			else if(isArray(data[k])){
				var adata = []
				for(var i in data[k]){
					adata.push(object_reverse_translate(data[k][i], translate[rky].data));									
				}
				rdata[rky] = adata;
			}
			else {
				rdata[rky] = data[k];
			}			
		}
		return rdata;
	}
	function object_merge(o1, o2){
		var ro = o1;
		for(var k in o2){
			if(ro[k]){
				if(isObject(ro[k])){
					object_merge(ro[k], o2[k]);
					continue;
				}
			}
			ro[k] = o2[k];
		}
		return ro;
	}	
	var tjson = null;
	/////////////////////////////////////////////////////////////////////////
	function show_json(){
		if(tjson == null){
			console.error('tjson is null no json data ?');
			return;
		}
		$(div).jsonEditor(tjson, { change: function(data){
			console.log(data);
			tjson = data;
		}, propertyclick: function(path){
			console.log(path);
		} });
		
	}
	return {
		reset: function(value){
			tjson = object_translate(value, translate);
			show_json();
		},
		json: function(){
			return object_merge(template, object_reverse_translate(tjson, translate));
		}
	}
}

