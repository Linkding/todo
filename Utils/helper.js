/**
 * 获取表单数据
 * @param String|HTMLFormElement 选择器或表单元素
 * @return Object e.g. {name: 'whh', age: 18}
 * */
function get_form_data(form) {
  /*看看是不是选择器，如果是选择器就一定是字符串。*/
  if (typeof form == 'string')
    form = document.querySelector(form); // 通过选择器拿到元素对象

  var data = {};
  var list = form.querySelectorAll('[name]');
  list.forEach(function (input) {
    switch (input.nodeName) {

      case 'INPUT':
        switch (input.type) {
          case 'text':
          case 'search':
          case 'number':
          case 'password':
          case 'hidden':
            /*如果是字符类数据，使用用户输入的值*/
            data[input.name] = input.value;
            break;
          case 'radio':
          case 'checkbox':
            /*如果是打钩类数据，使用打钩的状态（打|没打）*/
            data[input.name] = input.checked;
            break;
        }
        // console.log(input);
        break;
      case 'TEXTAREA':
        data[input.name] = input.value;
        break;
      case 'SELECT':
        data[input.name] = input.value;
        break;
    }
  });

  return data;
}

/**
 * 设置表单数据
 * @param String|HTMLFormElement 选择器或表单元素
 * @param Object 要设置的数据 e.g. {name: 'whh', age: 18}
 * @return void
 * */
function set_form_data(form, data) {
  /*看看是不是选择器，如果是选择器就一定是字符串。*/
  if (typeof form == 'string')
    form = document.querySelector(form); // 通过选择器拿到元素对象

  /*遍历数据对象*/
  for (var key in data) {
    /*缓存当前属性的值*/
    var value = data[key];
    /*找到当前属性在表单中对应的input*/
    var input = form.querySelector(`[name=${key}]`);

    if (!input)
      continue;

    /*获取当前属性的数据类型*/
    var data_type = typeof value;

    switch (data_type) {
      /*如果是字符串或者数字，就默认其为input[type=number|text|url|...]*/
      case 'string':
      case 'number':
        input.value = value;
        break;
      /*如果是布尔值，就默认其为input[type=radio|checkbox]*/
      case 'boolean':
        input.checked = value;
        break;
    }
  }
}

/**
 * 清空表单（并非重置表单）
 *
 * 将所有的字符类input设为空字符串；
 * 将所有radio和checkbox设为unchecked
 * @param String|HTMLFormElement 选择器或表单元素
 * */
function clear_form(form) {
  /*看看是不是选择器，如果是选择器就一定是字符串。*/
  if (typeof form == 'string')
    form = document.querySelector(form); // 通过选择器拿到元素对象

  form
    .querySelectorAll('[name]')
    .forEach(function (input) {
      if (input.type == 'radio' || input.type == 'checkbox')
        input.checked = false;
      else
        input.value = '';
    });
}

module.exports = {
  get_form_data: get_form_data,
  set_form_data: set_form_data,
  clear_form: clear_form,
}