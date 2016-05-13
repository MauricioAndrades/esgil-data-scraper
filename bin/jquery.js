$('.image-button').click(function() {
  var myTableArray = $('table#imgList tr').map(function() {
    var arrayOfThisRow = $(this).find('td').map(function() {
      return $(this).has('select').length ? $(this).find('select option:selected').text() : $(this).text();
    }).get();
    return arrayOfThisRow;
  }).get();
  console.log(myTableArray);
});

var arrTable = $('tbody').children().map(function() {
  var arrRow = $(this).find('td').map(function() {
    return $(this).has();
  });
});

var arr = $('tbody').children().toArray();

// arr.map(callback[,thisArgs])
function getTables(arr) {
  var nArray = arr.map(function(el, i) {
    if (el.hasAttribute('innerText')) {
      if (el.innerText !== '\u00a0' && el.innerText !== undefined) {
        return el.innerText;
      }
    }
  });
  return nArray;
}

var arr = [];
var mergedArray = [];
$('tbody').children().each(function() {
  if ($(this).text().length > 1) {
    arr.push(($(this).text().trim()));
  }
});

var mergedArray = [];

function mergeArray(array) {
  var i = 0;
  var j = 0;
  for (i; i < array.length; i += 8, j++) {
    mergedArray[j] = array[i].trim() + ' - ' + array[i + 1].trim() + ' - ' + array[i + 2].trim() +
      '-' + array[i + 3].trim() + '-' + array[i + 4].trim();
  }
  return mergedArray;
}

mergeArray(merged);


function printContent() {
  if (this.nodeValue) {
    merged.push(this.nodeValue);
  }
}

function DOMComb(node, callback) {
  if (node.hasChildNodes()) {
    for (var node = node.firstChild; node; node = node.nextSibling) {
      DOMComb(node, callback);
    }
  }
  callback.call(node);
}



var merged = [];
DOMComb(document.querySelector('tbody'), printContent)
