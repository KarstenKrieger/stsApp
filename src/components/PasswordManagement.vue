<template>
    <div id='container' class="center">
        <ejs-textbox ref="username" v-model="username" readonly="true"></ejs-textbox>
        <ejs-textbox ref="pwdp" :htmlAttributes="htmlAttributes" floatLabelType="Auto" placeholder="Password" v-model="passwd"></ejs-textbox>
        <span v-if="showpw" class="e-icons e-eye eyeclass" @click="showpw = !showpw"></span>
        <span v-if="!showpw" class="e-icons e-eye-slash eyeclass" @click="showpw = !showpw"></span>
        <ejs-textbox ref="pwdw" :htmlAttributes="htmlAttributes" floatLabelType="Auto" placeholder="Passwordwiederholung" v-model="repasswd"></ejs-textbox>
        <span v-if="showpw" class="e-icons e-eye eyeclass" @click="showpw = !showpw"></span>
        <span v-if="!showpw" class="e-icons e-eye-slash eyeclass" @click="showpw = !showpw"></span>
        <div class="center">
            <div class="buttonClassL e-secondary">
                <ejs-button cssClass='e-secondary' v-on:click="cancel">Abbrechen</ejs-button>
            </div>
            <div class="buttonClassR e-primary">
                <ejs-button cssClass='e-primary' v-on:click="pwdchange" :disabled="!noregister">Password &auml;ndern</ejs-button>
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
                token: localStorage.getItem("token"),
                username: localStorage.getItem("email"),
                passwd: '',
                repasswd: '',
                showpw: false,
                pwtype: 'password',
                noregister: false,
                position: { X: 'Right', Y: 'Bottom' },
                err: ''
            }
        },
        watch: {
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
            this.toasts = [
                { title: 'Erfolgreich:', content: 'Das Passwort wurde ge&auml;ndert.', cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
                { title: 'Fehler!', content: 'Das Passwort konnte nicht ge&auml;ndert werden. ' + this.err, cssClass: 'e-toast-danger', icon: 'e-error toast-icons' },
                { title: 'Warnung.', content: 'Das Passwort konnte nicht ge&auml;ndert werden.', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' }
            ]
        },
        methods: {
            async pwdchange() {
                var router = this.$router;
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'content-type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + this.token
                    },
                }

                await fetch(this.$serviceBaseUrl + 'Account/ChangePassword?username=' + this.username + '&newpassword=' + this.passwd, requestOptions)
                    .then(async resp => {
                        await resp.json()
                        if (!resp.ok) {
                            this.$refs.toastRef.show(this.toasts[2]);
                        }
                    })
                    .then(() => {
                        this.$refs.toastRef.show(this.toasts[0]);
                        setTimeout(function () {
                            router.push('/')
                        }, 5000)
                    })
                    .catch((err) => {
                        this.err = err;
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
    @font-face {
        font-family: 'Toast_icons';
        src: url(data:application/x-font-ttf;charset=utf-8;base64,AAEAAAAKAIAAAwAgT1MvMj0gSRkAAAEoAAAAVmNtYXDnM+eRAAABsAAAAEpnbHlmzVnmlwAAAhgAAAZAaGVhZBEYIl8AAADQAAAANmhoZWEHlgN3AAAArAAAACRobXR4LvgAAAAAAYAAAAAwbG9jYQnUCGIAAAH8AAAAGm1heHABHQBcAAABCAAAACBuYW1lfUUTYwAACFgAAAKpcG9zdAxfTDgAAAsEAAAAggABAAADUv9qAFoEAAAAAAAD6AABAAAAAAAAAAAAAAAAAAAADAABAAAAAQAACcU5MF8PPPUACwPoAAAAANcI7skAAAAA1wjuyQAAAAAD6APoAAAACAACAAAAAAAAAAEAAAAMAFAABwAAAAAAAgAAAAoACgAAAP8AAAAAAAAAAQPqAZAABQAAAnoCvAAAAIwCegK8AAAB4AAxAQIAAAIABQMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUGZFZABA5wDnCgNS/2oAWgPoAJYAAAABAAAAAAAABAAAAAPoAAAD6AAAA+gAAAPoAAAD6AAAA+gAAAPoAAAD6AAAA+gAAAPoAAAD6AAAAAAAAgAAAAMAAAAUAAMAAQAAABQABAA2AAAABAAEAAEAAOcK//8AAOcA//8AAAABAAQAAAABAAIAAwAEAAUABgAHAAgACQAKAAsAAAAAAAAAQgB8AMIA4gEcAZQCBgJwAo4DAAMgAAAAAwAAAAADlAOUAAsAFwAjAAABFwcXNxc3JzcnBycFDgEHLgEnPgE3HgEFHgEXPgE3LgEnDgEBTXh4L3h4L3h4L3h4AbwDt4qKtwMDt4qKt/0eBeuxsesFBeuxsesCbHh4L3h4L3h4L3h4p4q3AwO3ioq3AwO3irHrBQXrsbHrBQXrAAAAAwAAAAADlAOUAAUAEQAdAAABJwcXAScXDgEHLgEnPgE3HgEFHgEXPgE3LgEnDgEBr2UylwEbMqADt4qKtwMDt4qKt/0eBeuxsesFBeuxsesBrGQylgEcMqKKtwMDt4qKtwMDt4qx6wUF67Gx6wUF6wAAAAAFAAAAAAOUA5cABQARAB0AIQAlAAABFzcnNSMFDgEHLgEnPgE3HgEFHgEXPgE3LgEnDgElFzcnBRc3JwHKxiCnPwFOA6V8fKUDA6V8fKX9aATToJ/UBATUn5/UAh7ANsD9fja/NQGedzNj29F8pAMDpHx8pQMDpXyf1AQE1J+g0wQE0/GhQKGhQKFAAAQAAAAAA74DfgADAAcACgANAAAlMzUjNTM1IwEhCQEhAQHLUlJSUgFj/YwBOv42A5T+NuZUUqf+igIc/ZADFgAEAAAAAAOUA5QAAwAHABMAHwAAATM1IzUzNSMFDgEHLgEnPgE3HgEFHgEXPgE3LgEnDgEBylRUVFQBbgO3ioq3AwO3ioq3/R4F67Gx6wUF67Gx6wEk+lNT0Iq3AwO3ioq3AwO3irHrBQXrsbHrBQXrAAAAAAcAAAAAA+gDMQALABUAJQAuADcAQQBLAAABFhcVITUmJz4BMxYFFhcVITU+ATcWJQYHFSE1LgEjIgYHLgEjIgEWFAYiJjQ2MgUWFAYiJjQ2MiUGFBYXPgE0JiIFBhQWFz4BNCYiA1xEBP6sAxUeRiRX/qxEBP45BIlXV/7xZQsD6AvKUypvMzNvKlMCKxozTTMzTP6CGTNMNDRMAQItWUREWlqI/jstWkREWVmIAWMbFjc3IBgKDwQcGxY3NxY3BAQjJUt7e0tKFxgYFwEMGU01NU0zGhlNNTVNMxYthloCAlqGWy4thloCAlqGWwAAAAQAAAAAA5wCxwAIABQANABFAAABFBYyNjQmIgYXDgEHLgEnPgE3HgEfAQcOAQ8BNz4BNS4BJw4BBxQWHwEnLgEvATc+ATc2FiUOAQ8BFx4BNz4BPwEnJiciAb8fLR4eLR+wAkU0NEUBAUU0NEX8BgEemG0FBB8kAlZBQFcBKyUCCkeVTAYBH76RVMP+3bDPBwcKZclcu/AGCwrM2AoBxxYfHy0eHhc0RQEBRTQ1RQEBRSgEARpWGAECFUIoQVcCAldBLEYUAQEIQkAGASJsBwFCoRbFFAoJW0sBCo8LCgztAQAAAAIAAAAAA4ADbAA4AEEAAAEEJCcmDgEWFx4BHwEVFAYHDgEnJg4BFhcWNjc2Fx4BBx4BFzc+ASc2JicmJzUzPgE3PgEnJicjIiUUFjI2NCYiBgNM/tz+pwwMGxEDDAaMfAcSETKEQw8WBg8Og80hNSg4JwICEw0FDhECAjFJEBICPYhKDQgGChQCB/5dMUgxMUgxAuB/ZRcIAxgbCQdHEQGTGi8TOVgKAw8dFwMNuDUFHTGDCA0QAQECFQ8Mnz8LCasJKiUHGg0SATMkMDBJMDAAAAAAAgAAAAAC/QMkAAMADQAAAQchJxMeATMhMjY3EyEC2x3+bB0kBCQZAQQZJARH/ewDBuDg/fcZICAZAicAAwAAAAACzwPoACwAQwBPAAABERQfARYfAzMVHgE7ATI2NRE0JisBNTEWOwEyNjQmJyMiJi8BLgErAQ4BAxUzNTQ2NzMeARcVMzUuAScjIgcjESM1HgEXPgE3LgEnDgEBVQEBAwQCCAjXARENOg0REQ2zDROVExoaE2UQGAQfAxAKYg0RPR8RDZcNEQEeASIalxANAR8CTTo6TQEBTTo6TQJ8/nYEBQIGBAIFArYNERENARENEUoNGicZARMPfQoNARH98Hl5DREBARENeXkaIgEIAe3FOk0CAk06Ok0BAU0AAAAAAgAAAAAC5gMyAAkAEQAAJRQWMyEyNjURITcjFSE1IycjASApHgEaHin+WFBuAeR+JLD8HigoHgGfeT09HgAAAAAAEgDeAAEAAAAAAAAAAQAAAAEAAAAAAAEAEgABAAEAAAAAAAIABwATAAEAAAAAAAMAEgAaAAEAAAAAAAQAEgAsAAEAAAAAAAUACwA+AAEAAAAAAAYAEgBJAAEAAAAAAAoALABbAAEAAAAAAAsAEgCHAAMAAQQJAAAAAgCZAAMAAQQJAAEAJACbAAMAAQQJAAIADgC/AAMAAQQJAAMAJADNAAMAAQQJAAQAJADxAAMAAQQJAAUAFgEVAAMAAQQJAAYAJAErAAMAAQQJAAoAWAFPAAMAAQQJAAsAJAGnIEZpbmFsIFRvYXN0IE1ldHJvcFJlZ3VsYXJGaW5hbCBUb2FzdCBNZXRyb3BGaW5hbCBUb2FzdCBNZXRyb3BWZXJzaW9uIDEuMEZpbmFsIFRvYXN0IE1ldHJvcEZvbnQgZ2VuZXJhdGVkIHVzaW5nIFN5bmNmdXNpb24gTWV0cm8gU3R1ZGlvd3d3LnN5bmNmdXNpb24uY29tACAARgBpAG4AYQBsACAAVABvAGEAcwB0ACAATQBlAHQAcgBvAHAAUgBlAGcAdQBsAGEAcgBGAGkAbgBhAGwAIABUAG8AYQBzAHQAIABNAGUAdAByAG8AcABGAGkAbgBhAGwAIABUAG8AYQBzAHQAIABNAGUAdAByAG8AcABWAGUAcgBzAGkAbwBuACAAMQAuADAARgBpAG4AYQBsACAAVABvAGEAcwB0ACAATQBlAHQAcgBvAHAARgBvAG4AdAAgAGcAZQBuAGUAcgBhAHQAZQBkACAAdQBzAGkAbgBnACAAUwB5AG4AYwBmAHUAcwBpAG8AbgAgAE0AZQB0AHIAbwAgAFMAdAB1AGQAaQBvAHcAdwB3AC4AcwB5AG4AYwBmAHUAcwBpAG8AbgAuAGMAbwBtAAAAAAIAAAAAAAAACgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAECAQMBBAEFAQYBBwEIAQkBCgELAQwBDQAFRXJyb3IHU3VjY2VzcwVBbGFybQdXYXJuaW5nBEluZm8HTWVldGluZwVCbGluawdTdHJldGNoA1NpcANTaXQFVHJhc2gAAAAA) format('truetype');
        font-weight: normal;
        font-style: normal;
    }

    #toast_types button {
        margin: 5px;
        min-width: 160px;
        max-width: 160px;
    }



    .toast-icons {
        font-family: 'Toast_icons' !important;
        speak: none;
        font-size: 55px;
        font-style: normal;
        font-weight: normal;
        font-variant: normal;
        text-transform: none;
        line-height: 1;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    #toast_type .e-toast-icon.e-icons {
        height: auto;
        font-size: 30px;
    }

    .bootstrap5 #toast_type .e-toast-icon.e-icons,
    .bootstrap5-dark #toast_type .e-toast-icon.e-icons,
    .material3 #toast_type .e-toast-icon.e-icons,
    .material3-dark #toast_type .e-toast-icon.e-icons {
        height: 25px;
    }

    #toast_type .toast-icons.e-success::before {
        content: "\e701";
    }

    #toast_type .toast-icons.e-error::before {
        content: "\e700";
    }

    #toast_type .toast-icons.e-info::before {
        content: "\e704";
    }

    #toast_type .toast-icons.e-warning::before {
        content: "\e703";
    }

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