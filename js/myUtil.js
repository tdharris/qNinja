exports.isEmpty = function(obj) {
    // null and undefined are "empty"
    if (obj == null || obj == undefined) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Check files
    if (obj.name !== null || obj.name !== undefined) return false;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return true;
    }

    return false;
}