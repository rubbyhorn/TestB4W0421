"use strict"

b4w.register("canvas1", function(exports, require) {

var m_app       = require("app");
var m_cfg       = require("config");
var m_data      = require("data");
var m_preloader = require("preloader");
var m_ver       = require("version");

var m_anim      = require("animation");
var m_cont      = require("container");
var m_mouse     = require("mouse");
var m_scenes    = require("scenes");
var m_transform = b4w.require("transform");

var DEBUG = true;

var APP_ASSETS_PATH = "assets/";

m_cfg.set("physics_uranium_path", "node_modules/blend4web/dist/uranium/")

var _previous_selected_obj = null;

exports.init = init;
function init() {
    m_app.init({
        canvas_container_id: "canvas1",
        callback: init_cb,
        show_fps: DEBUG,
        console_verbose: DEBUG,
        autoresize: true
    });
}

function init_cb(canvas_elem, success) {

    if (!success) {
        console.log("b4w init failure");
        return;
    }

    m_preloader.create_preloader();

    // игнорируем клик правой кнопкой мыши на элементе canvas
    canvas_elem.oncontextmenu = function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };

    load();
}

function load() {
    m_data.load(APP_ASSETS_PATH + "main.json", load_cb, preloader_cb);
}


function preloader_cb(percentage) {
    m_preloader.update_preloader(percentage);
}

function load_cb(data_id, success) {

    if (!success) {
        console.log("b4w load failure");
        return;
    }
    m_app.enable_camera_controls();

    var canvas_elem = m_cont.get_canvas();
    canvas_elem.addEventListener("mousedown", main_canvas_click, false);
    canvas_elem.addEventListener("touchstart", main_canvas_click, false);
}

function main_canvas_click(e) {
    if (e.preventDefault)
        e.preventDefault();

    var x = m_mouse.get_coords_x(e);
    var y = m_mouse.get_coords_y(e);

    var obj = m_scenes.pick_object(x, y);
	console.log(obj);
    if (obj) {
        if (_previous_selected_obj) {
            m_anim.stop(_previous_selected_obj);
            m_anim.set_frame(_previous_selected_obj, 0);
        }
        _previous_selected_obj = obj;

        m_transform.rotate_x_local(obj, 30);
    }
}
})

b4w.require("canvas1", "canvas1").init();