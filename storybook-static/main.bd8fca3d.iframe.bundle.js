(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{1100:function(module,exports,__webpack_require__){"use strict";(function(module){(0,__webpack_require__(435).configure)([__webpack_require__(1101),__webpack_require__(1102)],module,!1)}).call(this,__webpack_require__(240)(module))},1101:function(module,exports){function webpackEmptyContext(req){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}webpackEmptyContext.keys=function(){return[]},webpackEmptyContext.resolve=webpackEmptyContext,module.exports=webpackEmptyContext,webpackEmptyContext.id=1101},1102:function(module,exports,__webpack_require__){var map={"./components/ImpactCounter.stories.jsx":1115};function webpackContext(req){var id=webpackContextResolve(req);return __webpack_require__(id)}function webpackContextResolve(req){if(!__webpack_require__.o(map,req)){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}return map[req]}webpackContext.keys=function webpackContextKeys(){return Object.keys(map)},webpackContext.resolve=webpackContextResolve,module.exports=webpackContext,webpackContext.id=1102},1114:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);var preview_namespaceObject={};__webpack_require__.r(preview_namespaceObject),__webpack_require__.d(preview_namespaceObject,"parameters",(function(){return parameters})),__webpack_require__.d(preview_namespaceObject,"decorators",(function(){return decorators}));__webpack_require__(23),__webpack_require__(6),__webpack_require__(54),__webpack_require__(1048),__webpack_require__(1049),__webpack_require__(52),__webpack_require__(1050),__webpack_require__(1051),__webpack_require__(525);var client_api=__webpack_require__(1156),esm=__webpack_require__(5),react=__webpack_require__(0),react_default=__webpack_require__.n(react),ThemeProvider=__webpack_require__(1149),createMuiTheme=__webpack_require__(583),utils_theme=(__webpack_require__(581),Object(createMuiTheme.a)({palette:{primary:{main:"#9d4ba3",contrastText:"#fff",background:"rgba(157, 75, 163, 0.08)"},secondary:{main:"#4a90e2",contrastText:"#fff"},text:{primary:"rgba(0, 0, 0, 0.80)"},colors:{purple1:"#9B51E0"},backgroundContrastText:{main:"rgba(0, 0, 0, 0.80)"}},typography:{fontSize:14,fontFamily:'"Helvetica Neue", Helvetica, Arial, sans-serif'},shape:{borderRadius:2}})),jsx_runtime=__webpack_require__(51),parameters=(react_default.a.createElement,{actions:{argTypesRegex:"^on[A-Z].*"},controls:{matchers:{color:/(background|color)$/i,date:/Date$/}}}),decorators=[function(Story){return Object(jsx_runtime.jsx)(ThemeProvider.a,{theme:utils_theme,children:Object(jsx_runtime.jsx)(Story,{})})}];function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function _defineProperty(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}Object.keys(preview_namespaceObject).forEach((function(key){var value=preview_namespaceObject[key];switch(key){case"args":case"argTypes":return esm.a.warn("Invalid args/argTypes in config, ignoring.",JSON.stringify(value));case"decorators":return value.forEach((function(decorator){return Object(client_api.c)(decorator,!1)}));case"loaders":return value.forEach((function(loader){return Object(client_api.d)(loader,!1)}));case"parameters":return Object(client_api.e)(function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach((function(key){_defineProperty(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}))}return target}({},value),!1);case"argTypesEnhancers":return value.forEach((function(enhancer){return Object(client_api.a)(enhancer)}));case"argsEnhancers":return value.forEach((function(enhancer){return Object(client_api.b)(enhancer)}));case"render":return Object(client_api.g)(value);case"globals":case"globalTypes":var v={};return v[key]=value,Object(client_api.e)(v,!1);default:return console.log(key+" was not supported :( !")}}))},1115:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"standard",(function(){return standard}));__webpack_require__(15),__webpack_require__(1103);var react=__webpack_require__(0),react_default=__webpack_require__.n(react),CircularProgress=__webpack_require__(1153),Typography=__webpack_require__(1152),Pets=__webpack_require__(582),Pets_default=__webpack_require__.n(Pets),makeStyles=__webpack_require__(1150),clsx_m=__webpack_require__(36),Popover=__webpack_require__(1154),jsx_runtime=__webpack_require__(51),useStyles=(react_default.a.createElement,Object(makeStyles.a)((function(){return{root:{zIndex:"10000000 !important"},popoverStyle:{width:"100%",height:3,backgroundColor:"white"}}}))),DashboardPopover_DashboardPopover=function DashboardPopover(props){var anchorEl=props.anchorEl,onClose=props.onClose,open=props.open,className=props.className,children=props.children,classes=useStyles();return Object(jsx_runtime.jsxs)(Popover.a,{open:open,anchorEl:anchorEl,onClose:onClose,anchorOrigin:{horizontal:"center",vertical:"bottom"},transformOrigin:{horizontal:"center",vertical:"top"},className:Object(clsx_m.a)(classes.root,className),children:[Object(jsx_runtime.jsx)("div",{className:classes.popoverStyle}),children]})};DashboardPopover_DashboardPopover.displayName="DashboardPopover",DashboardPopover_DashboardPopover.defaultProps={open:!1,anchorEl:void 0,onClose:void 0,className:"default",children:void 0},DashboardPopover_DashboardPopover.__docgenInfo={description:"",methods:[],displayName:"DashboardPopover",props:{open:{defaultValue:{value:"false",computed:!1},type:{name:"bool"},required:!1,description:""},anchorEl:{defaultValue:{value:"undefined",computed:!0},type:{name:"union",value:[{name:"func"},{name:"shape",value:{current:{name:"elementType",required:!1}}}]},required:!1,description:""},onClose:{defaultValue:{value:"undefined",computed:!0},type:{name:"func"},required:!1,description:""},className:{defaultValue:{value:"'default'",computed:!1},type:{name:"string"},required:!1,description:""},children:{defaultValue:{value:"undefined",computed:!0},type:{name:"union",value:[{name:"arrayOf",value:{name:"node"}},{name:"node"}]},required:!1,description:""}}};var components_DashboardPopover=DashboardPopover_DashboardPopover;"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/DashboardPopover.js"]={name:"DashboardPopover",docgenInfo:DashboardPopover_DashboardPopover.__docgenInfo,path:"src/components/DashboardPopover.js"});var Button=__webpack_require__(1155),ImpactCounter_useStyles=(react_default.a.createElement,Object(makeStyles.a)((function(){return{root:{width:"fit-content",display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center",boxShadow:"0px 2px 4px grey",borderRadius:"30px",padding:"0px","&:hover":{background:"white"}},petsIcon:{position:"relative",marginLeft:"-32px",marginRight:"8px"},counter:{marginRight:"14px",marginLeft:"14px"},popoverText:{padding:12,width:220},popover:{marginTop:10}}}))),ImpactCounter_ImpactCounter=function ImpactCounter(props){var classes=ImpactCounter_useStyles(),includeNumber=props.includeNumber,number=props.number,progress=props.progress,className=props.className,_useState=Object(react.useState)(!1),isPopoverOpen=_useState[0],setIsPopoverOpen=_useState[1],counterRef=Object(react.useRef)(void 0);return Object(jsx_runtime.jsxs)("div",{children:[Object(jsx_runtime.jsxs)(Button.a,{disableElevation:!0,className:Object(clsx_m.a)(classes.root,className),onClick:function onClick(){return setIsPopoverOpen(!0)},ref:counterRef,children:[includeNumber&&Object(jsx_runtime.jsx)(Typography.a,{className:classes.counter,variant:"h5",children:number}),Object(jsx_runtime.jsx)(CircularProgress.a,{variant:"determinate",value:0===progress?1:progress}),Object(jsx_runtime.jsx)(Pets_default.a,{className:classes.petsIcon})]}),Object(jsx_runtime.jsx)(components_DashboardPopover,{open:isPopoverOpen,anchorEl:counterRef.current,onClose:function onClose(){setIsPopoverOpen(!1)},className:classes.popover,children:Object(jsx_runtime.jsxs)("div",{className:classes.popoverText,children:[Object(jsx_runtime.jsx)(Typography.a,{variant:"body1",className:classes.dropdownText,gutterBottom:!0,children:"Your pawsitive impact!"}),Object(jsx_runtime.jsx)(Typography.a,{variant:"body2",className:classes.dropdownText,gutterBottom:!0,children:"This shows how many treats your tabs can provide to help shelter cats get adopted. Every tab you open helps. Keep it up!"})]})})]})};ImpactCounter_ImpactCounter.displayName="ImpactCounter",ImpactCounter_ImpactCounter.defaultProps={includeNumber:!1,number:0,className:""},ImpactCounter_ImpactCounter.__docgenInfo={description:"",methods:[],displayName:"ImpactCounter",props:{includeNumber:{defaultValue:{value:"false",computed:!1},type:{name:"bool"},required:!1,description:"Checks if the number of treats should be included"},number:{defaultValue:{value:"0",computed:!1},type:{name:"number"},required:!1,description:"The amount of treats a person has earned"},className:{defaultValue:{value:"''",computed:!1},type:{name:"string"},required:!1,description:""},progress:{type:{name:"number"},required:!0,description:"The progress to next treat as a number between 0 and 100"}}};var components_ImpactCounter=ImpactCounter_ImpactCounter;"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/ImpactCounter.js"]={name:"ImpactCounter",docgenInfo:ImpactCounter_ImpactCounter.__docgenInfo,path:"src/components/ImpactCounter.js"});react_default.a.createElement,__webpack_exports__.default={title:"Components/ImpactCounter",component:components_ImpactCounter,parameters:{progress:{values:[{name:"full",value:100},{name:"half full",value:50},{name:"empty",value:0}]}}};var ImpactCounter_stories_Template=function Template(args){return Object(jsx_runtime.jsx)(components_ImpactCounter,Object.assign({},args))};ImpactCounter_stories_Template.displayName="Template";var standard=ImpactCounter_stories_Template.bind({});standard.args={includeNumber:!0,number:10,progress:50},standard.parameters=Object.assign({storySource:{source:"(args) => <ImpactCounter {...args} />"}},standard.parameters)},605:function(module,exports,__webpack_require__){__webpack_require__(606),__webpack_require__(866),__webpack_require__(867),__webpack_require__(1107),__webpack_require__(1108),__webpack_require__(1116),__webpack_require__(1117),__webpack_require__(1113),__webpack_require__(1110),__webpack_require__(1118),__webpack_require__(1111),__webpack_require__(1112),__webpack_require__(1114),module.exports=__webpack_require__(1100)},680:function(module,exports){},758:function(module,exports){},867:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__(435)}},[[605,2,3]]]);