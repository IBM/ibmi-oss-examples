/* eslint-disable no-undef */
// eslint-disable-next-line no-undef

// creates $.delete and $.put functions
// these are not provided by jQuery
jQuery.each(['delete', 'put'], (i, method) => {
  jQuery[method] = (url, data, callback, type) => {
    if (jQuery.isFunction(data)) {
      type = type || callback;
      callback = data;
      data = undefined;
    }
    return jQuery.ajax({
      url,
      type: method,
      dataType: type,
      data,
      success: callback,
    });
  };
});
$.urlParam = (name) => {
  // eslint-disable-next-line no-useless-escape
  const results = new RegExp(`[\?&]${name}=([^&#]*)`).exec(window.location.href);
  return results[1] || 0;
};
