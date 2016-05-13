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


String.prototype.escapeChar = function(chars) {
  var foundChar = false;
  for (var i = 0; i < chars.length; ++i) {
    if (this.indexOf(chars.charAt(i)) !== -1) {
      foundChar = true;
      break;
    }
  }
  if (!foundChar) {
    return String(this);
  }
  var result = '';
  for (var i = 0; i < this.length; ++i) {
    if (chars.indexOf(this.charAt(i)) !== -1) {
      result += '\\';
    }
    result += this.charAt(i);
  }
  return result;
};

String.regexSpecialChar = function() {
  return '^[]{}()\\.^$*+?|-,';
};

String.prototype.escapeForRegExp = function() {
  return this.escapeChar(String.regexSpecialChar());
};

String.prototype.escapeHTML = function() {
  return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

function makeSearchRegex(query, flags) {
  var regexSpecialChar = String.regexSpecialChar();
  var regex = '';
  for (var i = 0; i < query.length; ++i) {
    var c = query.charAt(i);
    if (regexSpecialChar.indexOf(c) != -1)
      regex += '\\';
    regex += c;
  }
  return new RegExp(regex, flags || '');
}


function matchInArray(regex_obj, arr) {
  var match_arr = [];
  var oRegex = new RegExp(regex_obj);
  for (var i = 0; i < arr.length; i++) {
    var found = String(arr[i]).search(oRegex);
    if (found > -1) {
      match_arr.push(arr[i]);
    }
  }
  return match_arr
}

function regexSearch(arr, regularExpression) {
  return false;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // $& means the whole matched string
}
