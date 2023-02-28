document.onclick = function(e){ myFunction(getWord(e));};
//document.onclick = function(e){ myFunction()};
// didn't really test with touch device yet, but should be about the same...
document.ontouchend = function(e){ myFunction(getWord(e.touches[0]));};
//document.ontouchstart = function(e){myFunction()};
//document.ontouchstart = myFunction();

var title = document.getElementById("title").innerHTML;
var tale = document.getElementById("tale").innerHTML;
var caption = document.getElementById("caption").innerHTML;

function myFunction(t) {
  //console.log(`Voices #: ${speechSynthesis.getVoices().length}`)
  //speechSynthesis.getVoices().forEach((voice) => {
  //console.log(voice.name, voice.lang)})
    
  //document.getElementById("demo").innerHTML = t;
  if ( t == "-") return;
  if ( t.length == 0) return;
  console.log(`word length #: ${t.length}`);
  
  removeHighlights(document.body);
  highlightWord(document.body,t);
  
  let u = new SpeechSynthesisUtterance();
  u.text = t;
  u.lang = "el-GR";
  //u.lang = "de-DE";
  //u.voice = "Google Deutsch";
  speechSynthesis.speak(u);
}

function getWord(e) {
  console.log(`getWord #: ${e}`);
  // FF gives us a shortcut
  var target = e.explicitOriginalTarget || e.target,
    // We will use this to get the positions of our textNodes
    range = document.createRange(),
    rect, i;
  // so first let's get the textNode that was clicked
  if (target.nodeType !== 3) {
    var children = target.childNodes;
    i = 0;
    while (i < children.length) {
      range.selectNode(children[i]);
      rect = range.getBoundingClientRect();
      if (rect.left <= e.clientX && rect.right >= e.clientX &&
        rect.top <= e.clientY && rect.bottom >= e.clientY) {
        target = children[i];
        break;
      }
      i++;
    }
  }
  if (target.nodeType !== 3) {
    return '-';
  }
  // Now, let's split its content to words
  var words = target.nodeValue.split(' '),
    textNode, newText;
  i = 0;
  while (i < words.length) {
    // create a new textNode with only this word
    textNode = document.createTextNode((i ? ' ' : '') + words[i]);
    newText = words.slice(i + 1);
    // update the original node's text
    target.nodeValue = newText.length ? (' ' + newText.join(' ')) : '';
    // insert our new textNode
    target.parentNode.insertBefore(textNode, target);
    // get its position
    range.selectNode(textNode);
    rect = range.getBoundingClientRect();
    // if it is the one
    if (rect.left <= e.clientX && rect.right >= e.clientX &&
      rect.top <= e.clientY && rect.bottom >= e.clientY) {
      //remove punctuation
      var punctuationless = words[i].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
      var finalString = punctuationless.replace(/\s{2,}/g," ");
      //return the word
      return finalString;
    }
    i++;
  }
};

function highlightWord(root,word){
  console.log(`highlightWord #: ${word}`);
  textNodesUnder(root).forEach(highlightWords);

  function textNodesUnder(root){
    var n,a=[],w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null,false);
    console.log(`textNodesUnder #: ${n}`);
    while(n=w.nextNode()) a.push(n);
    return a;
  }

  function highlightWords(n){
    //console.log(`highlightWords #: ${n}`);
    for (var i; (i=n.nodeValue.indexOf(word,i)) > -1; n=after){
      var after = n.splitText(i+word.length);
      var highlighted = n.splitText(i);
      var span = document.createElement('span');
      span.className = 'highlighted';
      span.appendChild(highlighted);
      after.parentNode.insertBefore(span,after);
    }
  }
}

function removeHighlights(root){     
  //[].forEach.call(root.querySelectorAll('span.highlighted'),function(el){
  //  el.parentNode.replaceChild(el.firstChild,el);
  //});
  
  document.getElementById("title").innerHTML = title;
  document.getElementById("tale").innerHTML = tale;
  
  document.getElementById("caption").innerHTML = caption;
}
