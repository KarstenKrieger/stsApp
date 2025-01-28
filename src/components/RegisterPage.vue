<template>
    <div id='container' class="center">
        <p class="headline">Registrierung bei der STS-Finanzen-App</p>
        <span>Benutzername = Ihre E-Mailadresse</span>
        <ejs-textbox v-model="username"></ejs-textbox>
        <span>Password</span>
        <ejs-textbox ref="pwdp" :htmlAttributes="htmlAttributes" v-model="passwd"></ejs-textbox>
        <span v-if="showpw" class="e-icons e-eye eyeclass" @click="showpw = !showpw"></span>
        <span v-if="!showpw" class="e-icons e-eye-slash eyeclass" @click="showpw = !showpw"></span>
        <span>Password bitte wiederholen</span>
        <ejs-textbox ref="pwdw" :htmlAttributes="htmlAttributes" v-model="repasswd"></ejs-textbox>
        <span v-if="showpw" class="e-icons e-eye eyeclass" @click="showpw = !showpw"></span>
        <span v-if="!showpw" class="e-icons e-eye-slash eyeclass" @click="showpw = !showpw"></span>
        <div class="center">
            <div class="buttonClassL e-secondary">
                <ejs-button cssClass='e-secondary' v-on:click="cancel">Abbrechen</ejs-button>
            </div>
            <div class="buttonClassR e-primary">
                <ejs-button cssClass='e-primary' v-on:click="register" :disabled="!noregister">Registrieren</ejs-button>
            </div>
        </div>
    </div>
    <div>
        <ejs-toast ref='toastRef' id='toast_type' :position='position'></ejs-toast>
    </div>
</template>

<script>
    import { TextBoxComponent } from "@syncfusion/ej2-vue-inputs";
    import { ButtonComponent } from "@syncfusion/ej2-vue-buttons";
    import { ToastComponent } from '@syncfusion/ej2-vue-notifications';

    export default {
        components: {
            'ejs-textbox': TextBoxComponent,
            'ejs-button': ButtonComponent,
            'ejs-toast': ToastComponent
        },
        data() {
            return {
                htmlAttributes: { type: "password" },
                username: '',
                passwd: '',
                repasswd: '',
                showpw: false,
                pwtype: 'password',
                noregister: false,
                success: false,
                alreadyReg: false
            }
        },
        watch: {
            username: function (value) {
                this.noregister = false
                if (value && this.passwd) {
                    this.noregister = true
                }
            },
            passwd: function (value) {
                this.noregister = false
                if (value && this.repasswd) {
                    this.noregister = true
                }
                if (this.passwd === this.repasswd) {
                    this.noregister = true
                }
                else {
                    this.noregister = false
                }
            },
            repasswd: function (value) {
                this.noregister = false
                if (value && this.passwd) {
                    this.noregister = true
                }
                if (this.passwd === this.repasswd) {
                    this.noregister = true
                }
                else {
                    this.noregister = false
                }
            },
            showpw: function (value) {
                this.$refs.pwdp.$el.type = value ? 'text' : 'password'
                this.$refs.pwdw.$el.type = value ? 'text' : 'password'
            }
        },
        mounted() {
            this.error = false;
            this.toasts = [
                { title: 'Erfolgreich:', content: 'Die Registrierung wurde erfolgreich abgeschlossen. Sie erhalten eine E-Mail mit weiteren Anweisungen.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
                { title: 'Fehler!', content: 'Unterstützungsdienste sind nicht erreichbar oder login fehlerhaft. ' + this.err, cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
                { title: 'Warnung.', content: 'Die Registrierung wurde nicht erfolgreich abgeschlossen. Der Benutzer existiert bereits.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' }
            ]
        },
        methods: {
            async register() {
                var router = this.$router;
                this.alreadyReg = false
                this.success = false
                this.error = false
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'content-type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ username: this.username, password: this.passwd })
                }

                await fetch(this.$serviceBaseUrl + 'Account/Register', requestOptions)
                    .then(async resp => {
                        await resp.json()
                        if (!resp.ok) {
                            this.alreadyReg = true
                            this.noregister = false
                            this.$refs.toastRef.show(this.toasts[2]);
                        }
                        this.success = !this.alreadyReg
                        if (this.success)
                            this.$refs.toastRef.show(this.toasts[0]);
                        setTimeout(function () {
                            router.push('/')
                        }, 5000)
                    })
                    .catch((err) => {
                        this.toasts[1].content = this.toasts[1].content.replace(err, '') + ' ' + err
                        this.$refs.toastRef.show(this.toasts[1]);
                        this.noregister = false
                    })
            },
            cancel() {
                this.$router.push('/')
            }
        }
    }
</script>
<style>
    .center {
        margin: auto;
        width: 75%;
        padding: 10px;
    }

    .headline {
        text-align: center;
    }

    .buttonClassR {
        float: right;
        padding-top: 10px;
    }

    .buttonClassL {
        float: left;
        padding-top: 10px;
    }

    .msgclass {
        position: relative;
        top: 50px;
    }

    .eyeclass {
        float: right;
        position: relative;
        top: -22px;
    }
</style>