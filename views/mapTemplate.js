(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['map'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "\n<article class=\"maps\">\n   </div>\n  <div class=\"content\">\n    <p class=\"text\">\n      "
    + alias4(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"text","hash":{},"data":data}) : helper)))
    + "\n    </p>\n    <p class=\"attribution\">\n      <a href=\"#\">"
    + alias4(((helper = (helper = helpers.author || (depth0 != null ? depth0.author : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"author","hash":{},"data":data}) : helper)))
    + "</a>\n    </p>\n  </div>\n</article>\n";
},"useData":true});
})();
