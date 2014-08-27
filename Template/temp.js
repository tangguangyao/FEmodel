/*
*简易模板
*思路，正则挑选出<% ... %>中的内容，对应的换为指定内容
*/
var Temp = function(tpl, data) {
    var re = /<%([^%>]+)?%>/g;
    //依次正则匹配出<%%>包含的内容
    while (match = re.exec(tpl)) {
        var key = match[1].replace(/(^\s*)|(\s*$)/g, '');
        //替换内容
        tpl = tpl.replace(match[0], data[key]);
    }
    return tpl;
};

/*
*以上情况不适用于复杂的模板
*例如我们需要模板中又if判断，<% user.ip %>这种属性
*下面是扩展
*/

var TemplateEngine = function(html, options) {
    var re = /<%([^%>]+)?%>/g,
        reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
        code = 'var r=[];\n',
        cursor = 0;
    var add = function(line, js) {
        if (js) {
            if (line.match(reExp)) {
                code += line + '\n';
            } else {
                code += 'r.push(' + line + ');\n';
            }
        } else {
            if (line !== '') {
                code += 'r.push("' + line.replace(/"/g, '\\"') + '");\n';
            } else {
                code += '';
            }
        }
        return add;
    };

    while (match = re.exec(html)) {
        //add(html.slice(cursor, match.index))(match[1], true);
        var slHtml = html.slice(cursor, match.index);
        var add2 = add(slHtml);
        add2(match[1], true);
        cursor = match.index + match[0].length;
    }
    add(html.substr(cursor, html.length - cursor));
    code += 'return r.join("");';
    var codeRe = code.replace(/[\r\t\n]/g, '');
    return new Function(codeRe).apply(options);
};