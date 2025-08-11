/* ----
# Pio Plugin
# By: Dreamer-Paul
# Modify: journey-ad
# Last Update: 2021.5.4

A plugin supports switching Live2D models.

@author: https://paugram.com
---- */

var Paul_Pio = function (prop) {
    var that = this;

    var current = {
        idol: 0,
        menu: document.querySelector(".pio-container .pio-action"),
        canvas: document.getElementById("pio"),
        body: document.querySelector(".pio-container"),
        root: document.location.protocol + '//' + document.location.hostname + '/'
    };

    /* - Methods */
    var modules = {
        // Switch model
        idol: function () {
            current.idol < (prop.model.length - 1) ? current.idol++ : current.idol = 0;
            return current.idol;
        },
        // Create content
        create: function (tag, prop) {
            var e = document.createElement(tag);
            if (prop.class) e.className = prop.class;
            return e;
        },
        // Random content
        rand: function (arr) {
            return arr[Math.floor(Math.random() * arr.length + 1) - 1];
        },
        // Method to create message box
        render: function (text) {
            if (text.constructor === Array) {
                dialog.innerHTML = modules.rand(text);
            }
            else if (text.constructor === String) {
                dialog.innerHTML = text;
            }
            else {
                dialog.innerHTML = "X_X Wrong input.";
            }

            dialog.classList.add("active");

            clearTimeout(this.t);
            this.t = setTimeout(function () {
                dialog.classList.remove("active");
            }, 3000);
        },
        // Remove method
        destroy: function () {
            that.initHidden();
            localStorage.setItem("posterGirl", 0);
        },
        // Check if device is mobile
        isMobile: function () {
            var ua = window.navigator.userAgent.toLowerCase();
            return (ua.indexOf("mobile") !== -1 || ua.indexOf("android") !== -1 || ua.indexOf("ios") !== -1);
        }
    };
    this.modules = modules;
    this.destroy = modules.destroy;

    // Prevent the Live2D character from showing on mobile
    if (modules.isMobile()) {
        console.log('Mobile detected. Live2D will not be displayed.');
        return; // Stop execution and prevent any further initialization
    }

    var elements = {
        home: modules.create("span", { class: "pio-home" }),
        skin: modules.create("span", { class: "pio-skin" }),
        info: modules.create("span", { class: "pio-info" }),
        night: modules.create("span", { class: "pio-night" }),
        close: modules.create("span", { class: "pio-close" }),

        show: modules.create("div", { class: "pio-show" })
    };

    var dialog = modules.create("div", { class: "pio-dialog" });
    current.body.appendChild(dialog);
    current.body.appendChild(elements.show);

    /* - Message Tips */
    var action = {
        // Welcome msg
        welcome: function () {
            if (prop.tips) {
                var text, hour = new Date().getHours();

                if (hour > 22 || hour <= 5) {
                    text = "Heyo, night owl!";
                }
                else if (hour > 5 && hour <= 8) {
                    text = "Good morning";
                }
                else if (hour > 8 && hour <= 11) {
                    text = "Get up to work!";
                }
                else if (hour > 11 && hour <= 14) {
                    text = "Lunch time";
                }
                else if (hour > 14 && hour <= 17) {
                    text = "Sleepy afternoon zzZ...";
                }
                else if (hour > 17 && hour <= 19) {
                    text = "Evening! Beautiful sunset outside!";
                }
                else if (hour > 19 && hour <= 21) {
                    text = "Good evening! How's your day?";
                }
                else if (hour > 21 && hour <= 23) {
                    text = "Time for bed. Good night";
                }
                else {
                    text = "Fun fact: This message should never appear, haha!";
                }

                modules.render(text);
            }
            else {
                modules.render(prop.content.welcome || "Welcome to Axura's Blog!");
            }
        },
        // Touch Interaction
        touch: function () {
            current.canvas.onclick = function () {
                modules.render(prop.content.touch || ["Oops... was that just an accidental touch? (,,>﹏<,,)", "Touch me again and I'm calling the cops! ≧﹏≦", "HENTAI!", "Police officer? Help! There's a creep here who keeps touching me! (ᗒᗣᗕ)՞ "]);
            };
        },
        // Right-side menu buttons
        buttons: function () {
            // Go to homepage
            elements.home.onclick = function () {
                location.href = current.root;
            };
            elements.home.onmouseover = function () {
                modules.render(prop.content.home || "I know magic! Let me fly you back to the Home.");
            };
            current.menu.appendChild(elements.home);

            // Change model
            elements.skin.onclick = function () {
                that.model = loadlive2d("pio", prop.model[modules.idol()], model => {
                    prop.onModelLoad && prop.onModelLoad(model)
                    prop.content.skin && prop.content.skin[1] ? modules.render(prop.content.skin[1]) : modules.render("Do you like my new outfit?");
                });
            };
            elements.skin.onmouseover = function () {
                prop.content.skin && prop.content.skin[0] ? modules.render(prop.content.skin[0]) : modules.render("Want to see my new outfit?");
            };
            if (prop.model.length > 1) current.menu.appendChild(elements.skin);

            // About Me
            elements.info.onclick = function () {
                window.open(prop.content.link || "https://discord.com/channels/1235103752369995796/1255782068529401897");
            };
            elements.info.onmouseover = function () {
                modules.render("My master has tucked a secret in ... somewhere!\n(click to enter)");
            };
            current.menu.appendChild(elements.info);

            // Night Mode
            if (prop.night) {
                elements.night.onclick = function () {
                    eval(prop.night);
                };
                elements.night.onmouseover = function () {
                    modules.render("Switch to night mode.");
                };
                current.menu.appendChild(elements.night);
            }

            // Close the character
            elements.close.onclick = function () {
                modules.destroy();
            };
            elements.close.onmouseover = function () {
                modules.render(prop.content.close || "QWQ Don't abandon me.");
            };
            current.menu.appendChild(elements.close);
        }
    };

    /* - Run Mode */
    var begin = {
        static: function () {
            current.body.classList.add("static");
        },
        fixed: function () {
            action.touch();
            action.buttons();
        },
        draggable: function () {
            action.touch();
            action.buttons();
        }
    };

    // Initialization
    this.init = function (onlyText) {
        if (!(prop.hidden && modules.isMobile())) {
            if (!onlyText) {
                action.welcome();
                that.model = loadlive2d("pio", prop.model[0], model => {
                    prop.onModelLoad && prop.onModelLoad(model)
                });
            }
        }
    };

    // Hidden State
    this.initHidden = function () {
        current.body.classList.add("hidden");
        dialog.classList.remove("active");
    };

    localStorage.getItem("posterGirl") == 0 ? this.initHidden() : this.init();	
};
