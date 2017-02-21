Template.textEditor.rendered = function () {
	Session.set("editor-text", "");
};

Template.textEditor.helpers({
	'getText':function(){
		return Session.get("editor-text");
	}
});

Template.textEditor.events({
	'keyup .js-editor': function(event, template) {

		editorChange(event);
  	},

});

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function editorChange(event){
	var text = $(event.target).val().trim();

	var text = htmlEntities(text);

	text = replaceAll(text, "[bold]", "<b>"); text = replaceAll(text, "[/bold]", "</b>");
	text = replaceAll(text, "[italic]", "<i>"); text = replaceAll(text, "[/italic]", "</i>");
	text = replaceAll(text, "[underline]", "<u>"); text = replaceAll(text, "[/underline]", "</u>");
	text = replaceAll(text, "[code]", "<pre><code>"); text = replaceAll(text, "[/code]", "</code></pre>");
	text = replaceAll(text, "[quote]", "<blockquote>"); text = replaceAll(text, "[/quote]", "</blockquote>");
	text = replaceAll(text, "[title]", "<h5>"); text = replaceAll(text, "[/title]", "</h5>");
	text = replaceAll(text, "[list]", "<ul class='list'>"); text = replaceAll(text, "[/list]", "</ul>");
	text = replaceAll(text, "[bullet]", "<li class='bullet'>"); text = replaceAll(text, "[/bullet]", "</li>");
	text = replaceAll(text, "[number]", "<li class='numbered'>"); text = replaceAll(text, "[/number]", "</li>");

	text = text.replace(/\n/g, "<br />");


	Session.set("editor-text", text);
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(string, find, replace) {

  return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
