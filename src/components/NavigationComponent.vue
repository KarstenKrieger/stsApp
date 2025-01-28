<template>
    <div class="col-lg-12 control-section color-appbar-section">
        <div class="appbar-sample">
            <div class="color-appbar-container">
                <div class="col-md-12">
                    <ejs-appbar :colorMode=appBarColor>
                        <ejs-button cssClass="e-inherit menu" iconCss="e-icons e-menu" :created="onCreate"></ejs-button>
                        <ejs-button cssClass="e-inherit home e-appbar-menu">Dashboard</ejs-button>
                        <ejs-dropdownbutton :select="onSelect" :cssClass="'e-inherit e-appbar-menu ' + appBarColor.colorClass" :items="customerDataItems">Ihre Daten</ejs-dropdownbutton>
                        <ejs-dropdownbutton :select="onSelect" :cssClass="'e-inherit e-appbar-menu ' + appBarColor.colorClass" :items="documentItems">Dokumente</ejs-dropdownbutton>
                        <ejs-dropdownbutton :select="onSelect" :cssClass="'e-inherit e-appbar-menu ' + appBarColor.colorClass" :items="mediaItems">Medien</ejs-dropdownbutton>
                        <ejs-dropdownbutton :select="onSelect" :cssClass="'e-inherit e-appbar-menu ' + appBarColor.colorClass" :items="viewItems">Ansicht</ejs-dropdownbutton>
                        <div class="e-appbar-spacer"></div>
                        <div style="width: 200px; margin-right:10px">
                            <span class="e-input-group e-control-wrapper e-inherit">
                                <input type="text" class="e-searchinput e-input" placeholder="Suchen" />
                                <span class="e-icons e-search e-input-group-icon"></span>
                            </span>
                        </div>
                        <div class="e-appbar-separator"></div>
                        <ejs-tooltip ref="tooltip" position="Bottom Center" :content="userInformation">
                            <ejs-dropdownbutton :items="profileItems" class="e-custom" :select='onSelect'>
                                <div class="e-avatar e-avatar-small e-avatar-circle"><img :src="userInitial" /></div>
                                <span class="e-badge e-badge-primary e-badge-circle">{{messageCount}}</span>
                            </ejs-dropdownbutton>
                        </ejs-tooltip>
                        <div class="e-appbar-separator"></div>
                        <ejs-button :isPrimary=appBarColor.isPrimary v-on:click="logout">Abmelden</ejs-button>
                    </ejs-appbar>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
    .e-custom, .e-custom:hover, .e-custom:focus, .e-custom:active {
        background-color: transparent;
        color: #fff;
        border: none;
    }

    .avatar-badge .avatar-sub-block {
        display: inline-block;
        position: relative;
        margin: 9px;
    }

    .color-appbar-section .e-dropdown-btn.e-inherit,
    .color-appbar-section .e-btn.e-inherit.home {
        margin: 0 5px;
    }

    .color-appbar-section h1 {
        font-size: 18px;
    }

    .color-appbar-section .e-appbar-icon-menu {
        display: none;
    }

    .color-appbar-section .e-appbar .e-appbar-separator {
        margin: 0 10px;
    }

    @media screen and (max-width: 768px) {
        .color-appbar-section .e-appbar-icon-menu {
            display: block;
        }

        .color-appbar-section .login,
        .color-appbar-section .e-appbar-separator,
        .color-appbar-section .e-dropdown-btn.e-inherit.e-appbar-menu,
        .color-appbar-section .e-menu-wrapper.e-inherit.e-appbar-menu,
        .color-appbar-section .e-menu-wrapper.e-inherit.e-appbar-icon-menu .e-menu .e-menu-item .e-caret,
        .color-appbar-section .e-btn.e-inherit.e-appbar-menu {
            display: none;
        }

        .color-appbar-section .e-menu-wrapper.e-inherit.e-appbar-icon-menu ul .e-menu-item.e-menu-caret-icon {
            padding: 0 8px;
        }

        .color-appbar-section .e-menu-wrapper.e-inherit ul .e-menu-item .e-menu-icon {
            margin-right: 0;
        }

        .color-appbar-section .e-menu-wrapper.e-inherit {
            margin: 0 10px;
        }

        .fabric .color-appbar-section .e-menu-wrapper.e-inherit ul.e-menu:not(.e-vertical),
        .fabric-dark .color-appbar-section .e-menu-wrapper.e-inherit ul.e-menu:not(.e-vertical) {
            padding: 0;
        }

        .color-appbar-section .e-input-group.e-control-wrapper.e-inherit {
            margin-left: 10px;
        }

        .color-appbar-section .menu {
            margin-bottom: 3px;
        }

        .color-appbar-section .color-appbar-container {
            margin: 0 -30px;
        }
    }
</style>
<script>
    import { AppBarComponent, MenuComponent } from "@syncfusion/ej2-vue-navigations";
    import { DropDownButtonComponent } from '@syncfusion/ej2-vue-splitbuttons';
    import { ButtonComponent } from '@syncfusion/ej2-vue-buttons';
    import { TooltipComponent } from "@syncfusion/ej2-vue-popups";
    import router from '../router'

    export default {
        components: {
            'ejs-appbar': AppBarComponent,
            'ejs-menu': MenuComponent,
            'ejs-button': ButtonComponent,
            'ejs-dropdownbutton': DropDownButtonComponent,
            'ejs-tooltip': TooltipComponent
        },
        data: function () {
            return {
                messageCount: Math.floor(Math.random() * 13),
                userInitial: '',
                userInformation: '',
                profileItems: [
                    { text: "Profil ändern", iconCss: "e-icons e-settings", run: function () { router.push('editProfile'); } },
                    { text: "Passwort ändern", iconCss: "e-icons e-password", run: function () { router.push('passwordManagement'); } },
                    { text: "Nachrichten", iconCss: "e-icons e-comments" }
                ],
                customerDataItems: [
                    { text: 'Adresse' },
                    { text: 'Finanzen' },
                    { text: 'Kommunikation' },
                    { text: 'Privates' }
                ],
                documentItems: [
                    { text: 'Dokumente hochladen' },
                    { text: 'Meine Dokumente' }
                ],
                mediaItems: [
                    { text: 'Bilder Halloween 2024' },
                    { text: 'Bilder Kinderfest 2024' }
                ],
                viewItems: [],
                appBarColors: [
                    { colorMode: 'Light', colorClass: 'e-light', isPrimary: 'true', name: 'Dunkel' },
                    { colorMode: 'Dark', colorClass: 'e-dark', isPrimary: 'false', name: 'Hell' },
                    { colorMode: 'Primary', colorClass: 'e-primary', isPrimary: 'false', name: 'Blau' },
                    { colorMode: 'Inherit', colorClass: 'e-inherit', isPrimary: 'true', name: 'Hintergrund' }
                ],
                appBarColor: { colorMode: 'Light', colorClass: 'e-light', isPrimary: 'true', loginClass: 'login' }
            }
        },
        mounted: function () {
            try {
                this.userInitial = localStorage.getItem('initial') ? localStorage.getItem('initial') : this.generateAvatar(localStorage.getItem('firstname').charAt(0) + localStorage.getItem('lastname').charAt(0));
                this.userInformation = localStorage.getItem('firstname') + ' ' + localStorage.getItem('lastname') + '<br/>' + localStorage.getItem('email') + '<br/>E-Mailadresse ist ' + (localStorage.getItem('confirmed') ? '' : 'nicht ') + 'bestätigt.';
            } catch {
                this.userInitial = 'Please log in';
            }
            this.appBarColor = this.appBarColors[3];
            var selv = this;
            this.viewItems = this.appBarColors.map((p) => ({ text: p.name, run: function () { selv.appBarColor = p.colorMode; } }));
            let inputElement = document.querySelectorAll('.color-appbar-section .e-input-group .e-input');
            for (let i = 0; i < inputElement.length; i++) {
                inputElement[i].addEventListener("focus", function () {
                    let parentElement = this.parentNode;
                    if (parentElement.classList.contains('e-input-in-wrap')) {
                        parentElement.parentNode.classList.add('e-input-focus');
                    } else {
                        this.parentNode.classList.add('e-input-focus');
                    }
                });
                inputElement[i].addEventListener("blur", function () {
                    let parentElement = this.parentNode;
                    if (parentElement.classList.contains('e-input-in-wrap')) {
                        parentElement.parentNode.classList.remove('e-input-focus');
                    } else {
                        this.parentNode.classList.remove('e-input-focus');
                    }
                });
            }
        },
        methods: {
            beforeItemRender: function (args) {
                if (args.element.children.length > 0 && args.element.children[0].classList.contains("e-more-vertical-1")) {
                    args.element.setAttribute('aria-label', 'more vertical');
                }
            },
            onCreate: function () {
                let menuButtonElement = document.querySelectorAll('.color-appbar-section .e-inherit.menu');
                for (let j = 0; j < menuButtonElement.length; j++) {
                    if (!(menuButtonElement[j].hasAttribute("aria-label"))) {
                        menuButtonElement[j].setAttribute('aria-label', 'menu');
                    }
                }
            },
            onSelect: function (e) {
                e.item.run();
            },
            generateAvatar: function (text) {
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                const color = [
                    "#5050ff",
                    "#50ff50",
                    "#ff5050",
                    "#ff5000",
                    "#ff0050",
                    "#0050ff",
                    "#00ff50",
                    "#50ff00",
                    "#5000ff",
                ];
                var random = Math.floor(Math.random() * color.length);
                canvas.width = 200;
                canvas.height = 200;
                // Draw background
                context.fillStyle = `${color[random]}80`;
                context.fillRect(0, 0, canvas.width, canvas.height);
                // Draw text
                context.font = "bold 80px Arial";
                context.fillStyle = 'white';
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.fillText(text, canvas.width / 2, canvas.height / 2);
                var data = canvas.toDataURL("image/png");
                localStorage.setItem("initial", data);
                return data;
            },
            logout: function () {
                localStorage.clear();
                router.push('login');
            },
        }
    }
</script>
