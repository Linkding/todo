var task = require('../Api/TaskApi')
var helper = require('../Utils/helper')
module.exports = TaskUi;

test_list = [
    { // 0
        id: 100,
        title: '买菜',
        completed: false,
        cat_id: 2,
    },
    { // 1
        id: 101,
        title: '洗菜',
        completed: false,
        cat_id: 2,
    },
    {
        id: 102,
        title: '背单词',
        completed: false,
        cat_id: 3,
    },
]

function TaskUi(config) {
    var default_config = {
        form_selector: '#todo-form',
        list_selector: '#todo-list',
        input_selector: '#todo-input',
        incomplete_list_selector: '.incomplete',
        complete_list_selector: '.completed',
        on_init: null,
        on_input_focus:null,
        on_input_blur:null,
        on_add_succeed: null,
    }

    var c = this.config = Object.assign({}, default_config, config);

    this.form = document.querySelector(c.form_selector);
    this.list = document.querySelector(c.list_selector);
    this.input = document.querySelector(c.input_selector);
    this.incomplete_list = this.list.querySelector(c.incomplete_list_selector);
    this.completed_list = this.list.querySelector(c.complete_list_selector)
    this._api = task;
}

TaskUi.prototype.init = init;
TaskUi.prototype.render = render;
TaskUi.prototype.detect_add = detect_add;
TaskUi.prototype.detect_click_list = detect_click_list;
TaskUi.prototype.get_form_data = helper.get_form_data;
TaskUi.prototype.set_form_data = helper.set_form_data;
TaskUi.prototype.detect_input_focus = detect_input_focus;

function init() {
    var cb = this.config.on_init;
    this.render();
    this.detect_add();
    this.detect_click_list();
    this.detect_input_focus();
    if(cb){
        cb();
    }
}

function detect_input_focus(){
    var me = this;
    this.input.addEventListener('focus',function(e){
        var  cb = me.config.on_input_focus;
        if(cb)
            cb();
    })
}
function render(cat_id) {
    var todo_list = cat_id ?
                    this._api.read_by_cat(cat_id):
                    this._api.read();
    var me = this
        , holder = `<div class="empty-holder">暂无内容</div>`;

    //清空上次渲染的数据
    this.incomplete_list.innerHTML = '';
    this.completed_list.innerHTML = '';
    
    todo_list = todo_list || [];

    todo_list.forEach(function (item) {
        var el = document.createElement('div');
        el.classList.add('row', 'todo-item');
        el.dataset.id = item.id;

        el.innerHTML = `
        <div class="col checkbox">
        <input class="checker" type="checkbox" ${item.completed ? 'checked' : ''}>
        </div>
        <div class="col detail">
            <div class="title">${item.title}</div>
        </div>
        <div class="col tool-set">
            <button class="update">更新</button>
            <button class="remove">删除</button>
        </div>
        `
            ;
        if(item.completed){
            me.completed_list.appendChild(el);
        } else {
            me.incomplete_list.appendChild(el);
        }
    });
    if(!this.incomplete_list.innerHTML)
        this.incomplete_list.innerHTML  = holder;
    if(!this.completed_list.innerHTML)
        this.completed_list.innerHTML = holder;

}

function detect_add() {
    var me = this;
    this.form.addEventListener('submit', function (e) {
        e.preventDefault();
        var row = me.get_form_data(me.form);
        var cb = me.config.on_add_succeed;

        if (row.id) {
            me._api.update(row.id, row)
        } else {
            me._api.add(row)
        }
        //重新渲染
        me.render();
        /*清空输入框*/
        me.input.value = '';

        if(cb)
            cb();
    })
}

function detect_click_list() {
    var me = this;
    this.list.addEventListener('click', function (e) {
        var target = e.target
            , todo_item = target.closest('.todo-item')
            , id = todo_item.dataset.id
            , is_update_btn = target.classList.contains('update')
            , is_delete_btn = target.classList.contains('remove')
            , is_checkbox  = target.classList.contains('checker')
            ;

        if (is_delete_btn) {
            me._api.remove(id)
            me.render();
        } else if (is_update_btn) {
            var row = me._api.$find(id)
            me.set_form_data(me.form, row)
        } else if(is_checkbox){
            me._api.set_completed(id,target.checked)
            me.render();
        }
    })
}