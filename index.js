var CatUi = require('./Ui/CatUi');
var TaskUi = require('./Ui/TaskUi');

var cat_select = document.getElementById('cat-select');
// ======= task_ui=========
var task_ui = new TaskUi({
    on_init: render_cat_option,
    on_input_focus: show_cat_select,
    on_input_blur: function () { },
    on_add_succeed: hide_cat_select,
});

function render_cat_option() {
    var cat_list = cat_ui._api.read();//拿到分组数据

    cat_select.innerHTML = '';//清空

    if(!cat_list)
        return;
    
    cat_list.forEach(function (row) {
        var el = document.createElement('option');
        el.value = row.id;
        el.innerText = row.title;
        cat_select.appendChild(el);

    })
}

function show_cat_select() {
    cat_select.hidden = false;
}

function hide_cat_select() {
    cat_select.hidden = true;
}
// ==========cat ui============
var cat_ui = new CatUi({
    on_item_click: render_task,
    on_item_delete: remove_task_by_cat,
    on_sync: function (change_list) {
        render_cat_option();
    },
});

function render_task(cat_id) {
    task_ui.render(cat_id);
}
/**
 * 通过分类删除任务
 * @param Number cat_id 分类id
 * */
function remove_task_by_cat(cat_id) {
    task_ui._api.remove_by_cat(cat_id);
    task_ui.render(1);
}
task_ui.init();
cat_ui.init()
// })();
