

function show_json_table(div, results){
    div.innerHTML = 'show json data here !';
}

function show_single_battle(div, battle){
    console.log('show single battle here !');
    div.innerHTML = 'show single battle here !';
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//jctr should be a table
function table_json(jdata, has_th)
{
	if(jdata instanceof Array)
	{
		var trs = '<table><tr><tr><th>索引</th><th>值</th></tr>';
        if(!has_th) {
            trs = '<table>';
        }
		for(i in jdata)
		{
			//tr
			trs += '<tr><td>';
            var idx = Number(i)+1;
			trs += '#' + String(idx) + '</td><td>';
			trs += table_json(jdata[i]);
			trs += '</td></tr>';
		}
		trs += '</table>';
		return trs;
	}

	//basic type
	if(typeof(jdata) == 'boolean' ||
	   typeof(jdata) == 'string' ||
	   typeof(jdata) == 'number' )
	{
		return String(jdata);
	}

	//object
	if(typeof(jdata) == 'object' )
	{
		var trs = '<table><tr><th>字段</th><th>值</th></tr>';
        if(!has_th) {
            trs = '<table>';
        }
		for (k in jdata)
		{
			trs += '<tr><td>';
			trs += k + '</td><td>';
			trs += table_json(jdata[k], has_th);
			trs += '</td></tr>';
		}
		trs += '</table>';
		return trs;
	}
	else
	{
		console.log('error type !' + typeof(jdata));
		return "error!!!";
	}
}
function show_table_json(jtable_obj, jdata, has_th)
{
	var jtable = table_json(jdata, has_th);
	jtable_obj.innerHTML = jtable;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function append_row(item)
{
    var tr = item.parentElement.parentElement;
    var last_row = new String();
    last_row = tr.innerHTML;
    //[]
    var last_row_idx = tr.parentElement.rows.length ;
    if(item.getAttribute('data-hasth') == '0')
    {
        //no th
        last_row_idx += 1;
    }
    last_row = last_row.replace(/#[0-9]+/, '#'+String(last_row_idx));
    tr.parentElement.innerHTML += last_row;
}
function remove_row(item)
{
    var tr = item.parentElement.parentElement;
    tr.remove();
}
function form_json(jdata, has_th)
{
	if(jdata instanceof Array)
	{
		var trs = '<table><tr><th>索引</th><th>值</th><th>添加/删除</th></tr>';
        if(!has_th){
		    trs = '<table>';
        }
		for(i in jdata)
		{
			//tr
			trs += '<tr><td >';
            var idx = Number(i)+1;
			trs += '#' + String(idx) + '</td><td>';
			trs += form_json(jdata[i], has_th);
			trs += '</td><td><a href="#" onclick="append_row(this);" style="margin-right:1em;" data-hasth="'+ String(has_th?1:0) +'">添加</a><a href="#" onclick="remove_row(this);">删除</a></td></tr>';
		}
		trs += '</table>';
		return trs;
	}
	//basic type
	if(typeof(jdata) == 'boolean' ||
	   typeof(jdata) == 'number' )
	{
		return  '<input type="number" value="'+String(jdata)+'"/>';
	}
	else
	if(typeof(jdata) == 'string')
	{
		if(jdata.indexOf('multi-line') >= 0)
		{
			return  '<textarea maxLength="1024" style="width:100%;height:16em;">'+String(jdata)+'</textarea>';
		}
		else
		if(jdata.indexOf('date-time') >= 0)
		{
			return  '<input type="datetime-local" value="'+ jdata.split('::')[1] +'" />';
		}
		else
		{
			return  '<input type="text" maxLength="100" value="'+String(jdata)+'" />';
		}
	}
	//object
	if(typeof(jdata) == 'object' )
	{
		var trs = '<table><tr><th>字段</th><th>值</th></tr>';
        if(!has_th){
		    trs = '<table>';
        }
		for (k in jdata)
		{
			trs += '<tr><td>';
			trs += k + '</td><td>';
			trs += form_json(jdata[k], has_th);
			trs += '</td></tr>';
		}
		trs += '</table>';
		return trs;
	}
	else
	{
		console.log('error type !' + typeof(jdata));
		return "error!!!";
	}
}
function get_form_json(evalue_obj, has_th)
{
    if(evalue_obj.tagName == 'INPUT')
    {
        if(evalue_obj.type == 'text')
        {
            return evalue_obj.value;
        }
        else
        if(evalue_obj.type == 'number')
        {
            return Number(evalue_obj.value);
        }
        else
       	if(evalue_obj.type == 'datetime-local')
       	{
       		console.log(evalue_obj.value);
       		var dtoffset = (new Date()).getTimezoneOffset() * 60 ;//ms
       		//utc time
       		var dt = new Date(evalue_obj.value).getTime()/1000 + dtoffset;
       		return dt;
       	}
    }
    else
    if(evalue_obj.tagName == 'TEXTAREA')
    {
        return evalue_obj.value;
    }
    else
    if(evalue_obj.tagName == 'DIV')
    {
       return get_form_json(evalue_obj.children[0], has_th);
    }
    else
    if(evalue_obj.tagName == 'TABLE')
    {
        //array
        var jdata = [];
        var trs = evalue_obj.children[0].children;
	if(trs.length == 0)
	{
		return jdata;
	}
        if(trs[0].children.length == 2)
        {
            //object
            jdata = {};
        }
        else
        if(trs[0].children.length != 3)
        {
            //not obj , not array
            return 'ERROR!!';
        }
        var init_idx = 1;
        if(!has_th ){
            init_idx = 0;
        }
        for( var i = init_idx; i < trs.length; ++i)
        {
            //tr
            var tr = trs[i];
            //value
            var evobj = tr.children[1].children[0];
            //name value
            //index value op
            if(typeof(jdata) == 'object')
            {
                var ename = tr.children[0].innerText;//td0
                jdata[ename] = get_form_json(evobj);
            }
            else
            {
                jdata.push(get_form_json(evobj));
            }
        }
        return jdata;
    }
    return 'ERROR!';
}
function show_form_json(jtable_obj, jdata, has_th)
{
	var jtable = form_json(jdata, has_th);
	jtable_obj.innerHTML = jtable;
}
