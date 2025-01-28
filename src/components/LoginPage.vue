<template>
    <div id='container' v-bind:style="{opacity: opacity}">
        <div class="e-card-header center">
            <div class="e-card-header-caption center">
                <img src="https://sts-finanzen.de/wp-content/uploads/2020/04/Schumacher_FuC_Logo_RGB_450x70.png"/>
                <p class="center">Anmeldung</p>
            </div>
        </div>
        <div class="e-card-content center">
            <div>
                <span>Benutzername</span>
                <ejs-textbox v-model="username"></ejs-textbox>
                <span>Password</span>
                <ejs-textbox ref="pwd" :htmlAttributes="htmlAttributes" v-model="passwd"></ejs-textbox>
                <span v-if="showpw" class="e-icons e-eye eyeclass" @click="showpw = !showpw"></span>
                <span v-if="!showpw" class="e-icons e-eye-slash eyeclass" @click="showpw = !showpw"></span>
            </div>
        </div>
        <div class="e-card-content center">
            <div class="buttonClassL">
                <ejs-button cssClass='e-primary' v-on:click="register">Registrieren</ejs-button>
            </div>
            <div class="buttonClassR e-primary">
                <ejs-button cssClass='e-primary' :disabled="!noLogin" v-on:click="login">Anmelden</ejs-button>
            </div>
        </div>
        <div class="msgclass">
            <ejs-message cssClass="e-content-center" v-if="error" id="msg_error_outlined" severity="Error">{{ errorMsg }}</ejs-message>
        </div>
    </div>
</template>

<script>
    // import headers from "../lib/headers.js"
    import { TextBoxComponent } from "@syncfusion/ej2-vue-inputs";
    import { ButtonComponent } from "@syncfusion/ej2-vue-buttons";
    import { MessageComponent } from '@syncfusion/ej2-vue-notifications';
    import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';

    export default {
        components: {
            'ejs-textbox': TextBoxComponent,
            'ejs-button': ButtonComponent,
            'ejs-message': MessageComponent
        },
        data() {
            return {
                htmlAttributes: { type: "password" },
                username: '',
                passwd: '',
                noLogin: false,
                showpw: false,
                pwtype: 'password',
                error: false,
                errorMsg: '',
                opacity: 1
            }
        },
        mounted: function () {
            createSpinner({
                target: document.getElementById("container"),
            });
        },
        watch: {
            username: function (value) {
                this.noLogin = false
                if (value && this.passwd) {
                    this.noLogin = true
                }
            },
            passwd: function (value) {
                this.noLogin = false
                if (value && this.username) {
                    this.noLogin = true
                }
            },
            showpw: function (value) {
                this.$refs.pwd.$el.type = value ? 'text' : 'password'
            }
        },
        methods: {
            async login() {
                this.error = false;
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'content-type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ userName: this.username, password: this.passwd })
                }

                this.opacity = .5;
                showSpinner(document.getElementById('container'));

                await fetch(this.$serviceBaseUrl + 'Account/GetTokenCode', requestOptions)
                    .then(() => {
                        hideSpinner(document.getElementById('container'));
                        this.opacity = 1;
                        this.$router.push({ name: 'token' })
                    })
                    .catch((err) => {
                        hideSpinner(document.getElementById('container'));
                        this.opacity = 1;
                        switch (err) {
                            case 401:
                                {
                                    this.showError('Login fehlerhaft. Benutzer ist unbekannt oder das Password ist nicht korrekt.')
                                    break;
                                }
                            default:
                                {
                                    this.showError('Unterstützungsdienste sind nicht erreichbar. ' + err)
                                }
                        }
                    })
            },
            showError(err) {
                this.error = true
                this.errorMsg = err
            },
            register() {
                this.$router.push({ name: 'register' })
            }
        }
    }
</script>
<style>
    body {
        background-image: url("https://sts-finanzen.de/wp-content/uploads/2020/05/STS-Finanzen-Header-Willkommen.jpg");
        background-repeat: no-repeat;
        background-position: right top;
        background-attachment: fixed;
    }
    .buttonClassR {
        float: right;
    }

    .buttonClassL {
        float: left;
    }

    .msgclass {
        margin: 0 auto;
        max-width: 400px;
        padding-top: 10px;
    }

    .eyeclass {
        float: right;
        position: relative;
        top: -22px;
        right:5px;
    }

</style>
