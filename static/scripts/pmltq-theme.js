define("ace/theme/pmltq",["require","exports","module","ace/lib/dom"], function(require, exports, module) {

  exports.isDark = false;
  exports.cssClass = "ace-pmltq";
  exports.cssText = ".ace-pmltq .ace_gutter {\
background: #ebebeb;\
color: #333;\
overflow : hidden;\
}\
.ace-pmltq .ace_print-margin {\
width: 1px;\
background: #e8e8e8;\
}\
.ace-pmltq {\
background-color: #FFFFFF;\
color: black;\
}\
.ace-pmltq .ace_cursor {\
color: black;\
}\
.ace-pmltq .ace_invisible {\
color: rgb(191, 191, 191);\
}\
.ace-pmltq .ace_constant.ace_buildin {\
color: rgb(88, 72, 246);\
}\
.ace-pmltq .ace_constant.ace_language {\
color: rgb(88, 92, 246);\
}\
.ace-pmltq .ace_constant.ace_library {\
color: rgb(6, 150, 14);\
}\
.ace-pmltq .ace_invalid {\
background-color: rgb(153, 0, 0);\
color: white;\
}\
.ace-pmltq .ace_fold {\
}\
.ace-pmltq .ace_support.ace_function {\
color: rgb(60, 76, 114);\
}\
.ace-pmltq .ace_support.ace_constant {\
color: rgb(6, 150, 14);\
}\
.ace-pmltq .ace_support.ace_type,\
.ace-pmltq .ace_support.ace_class\
.ace-pmltq .ace_support.ace_other {\
color: rgb(109, 121, 222);\
}\
.ace-pmltq .ace_variable.ace_parameter {\
font-style:italic;\
color:#FD971F;\
}\
.ace-pmltq .ace_keyword.ace_operator {\
color: rgb(104, 118, 135);\
}\
.ace-pmltq .ace_comment {\
color: #236e24;\
}\
.ace-pmltq .ace_comment.ace_doc {\
color: #236e24;\
}\
.ace-pmltq .ace_comment.ace_doc.ace_tag {\
color: #236e24;\
}\
.ace-pmltq .ace_constant.ace_numeric {\
color: rgb(0, 0, 205);\
}\
.ace-pmltq .ace_variable {\
color: rgb(49, 132, 149);\
}\
.ace-pmltq .ace_xml-pe {\
color: rgb(104, 104, 91);\
}\
.ace-pmltq .ace_entity.ace_name.ace_function {\
color: #0000A2;\
}\
.ace-pmltq .ace_heading {\
color: rgb(12, 7, 255);\
}\
.ace-pmltq .ace_list {\
color:rgb(185, 6, 144);\
}\
.ace-pmltq .ace_marker-layer .ace_selection {\
background: rgb(181, 213, 255);\
}\
.ace-pmltq .ace_marker-layer .ace_step {\
background: rgb(252, 255, 0);\
}\
.ace-pmltq .ace_marker-layer .ace_stack {\
background: rgb(164, 229, 101);\
}\
.ace-pmltq .ace_marker-layer .ace_bracket {\
background: yellow;\
}\
.ace-pmltq .ace_marker-layer .ace_active-line {\
}\
.ace-pmltq .ace_gutter-active-line {\
background-color : #dcdcdc;\
}\
.ace-pmltq .ace_marker-layer .ace_selected-word {\
background: rgb(250, 250, 255);\
border: 1px solid rgb(200, 200, 250);\
}\
.ace-pmltq .ace_storage,\
.ace-pmltq .ace_keyword,\
.ace-pmltq .ace_meta.ace_tag {\
color: rgb(147, 15, 128);\
}\
.ace-pmltq .ace_string.ace_regex {\
color: rgb(255, 0, 0)\
}\
.ace-pmltq .ace_string {\
color: #1A1AA6;\
}\
.ace-pmltq .ace_entity.ace_other.ace_attribute-name {\
color: #994409;\
}\
.ace-pmltq .ace_indent-guide {\
background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==\") right repeat-y;\
}\
.ace_VAR {\
color: rgb(255,0,0);\
}\
.ace_VAR_H {\
background-color: rgb(255,255,100);\
}\
.ace_CREF {\
color: rgb(200,55,0);\
}\
.ace_TYPE {\
color: violet;\
}\
.ace_OPERATOR {\
color: rgb(50,50,255);\
}\
.ace_ATTRIBUTE {\
color: rgb(155,130,50);\
}\
.ace_rPAR, .ace_lPAR, .ace_FILTER, .ace_SEMICOLON {\
color: rgb(0,100,150);\
}\
.ace_PAR {\
color: rgb(100,100,100);\
}\
.ace_KEYWORD {\
color: blue;\
}\
.ace_RELATION {\
color: rgb(100,150,0);\
}\
.ace_FUNC {\
color: rgb(150,50,100);\
}\
.ace_AFUNC {\
color: rgb(100,0,150);\
}\
.ace_PARAMS {\
color: rgb(250,100,130);\
}\
.ace_MEMBER {\
color: rgb(80,140,0);\
}\
.ace_TYPEPREFIX {\
color: rgb(120,10,110);\
}\
.ace_D {\
background: rgb(255,230,220) !important;\
}\
.ace_D2 {\
background: rgb(220,230,255) !important;\
}\
.ace_D3 {\
background: rgb(220,255,230) !important;\
}\
.ace_D4 {\
background: rgb(220,155,230) !important;\
}\
.ace_D5 {\
background: rgb(220,225,130) !important;\
}\
.ace_ERROR {\
color:black !important;\
background: red !important;\
}\
.ace_OK {\
background: rgba(240,255,0,0.8) !important;\
}\
.ace_ERROR1 {\
background: yellow !important;\
}\
.ace_OCCURRENCES {\
color: rgb(80,0,140);\
}\
.ace_UNKNOWN {\
color: #fff;\
background: #000;\
}\
";

  var dom = require("../lib/dom");
  dom.importCssString(exports.cssText, exports.cssClass);
});
