<template>
    <div>
        <ejs-toast cssClass='e-control e-toast e-lib e-toast-container' ref='toastRef' id='toast_default' :position='position'></ejs-toast>
    </div>
    <div id='container' v-bind:style="{opacity: opacity}">
        <div class="e-card-header center">
            <div class="e-card-header-caption center">
                <img src="https://sts-finanzen.de/wp-content/uploads/2020/04/Schumacher_FuC_Logo_RGB_450x70.png" />
                <p class="center">Anmeldung</p>
            </div>
        </div>
        <div class="e-card-content center">
            <div class="otp-container">
                <label>Bitte den Code eingeben</label>
                <ejs-otpinput type="password" length="6" stylingMode="filled" v-model="tokenCode" @keydown="processToken()"></ejs-otpinput>
            </div>
        </div>
        <div class="e-card-content center">
            <div class="buttonClassR e-primary">
                <ejs-button cssClass='e-primary' :disabled="!noLogin" v-on:click="login">Anmelden</ejs-button>
            </div>
        </div>
    </div>
</template>

<script>
    // import headers from "../lib/headers.js"
    import { ButtonComponent } from "@syncfusion/ej2-vue-buttons";
    import { ToastComponent } from "@syncfusion/ej2-vue-notifications";
    import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
    import { OtpInputComponent } from '@syncfusion/ej2-vue-inputs';

    export default {
        components: {
            'ejs-button': ButtonComponent,
            'ejs-otpinput': OtpInputComponent,
            'ejs-toast': ToastComponent
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
                opacity: 1,
				tokenCode: '',
                position:{
                    X: 'Right'
                }
            }
        },
        mounted: function () {
            createSpinner({
                target: document.getElementById("container"),
            });
        },
        watch: {
            tokenCode: function(value) {
				if (value !== undefined) {
					this.noLogin = value.toString().length == 6
				}
            }
        },
        methods: {
			processToken() {
					this.noLogin = this.tokenCode == 6
			},
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
                }

                this.opacity = .5;
                showSpinner(document.getElementById('container'));

                await fetch(this.$serviceBaseUrl + 'Account/Login?tokenCode='+this.tokenCode, requestOptions)
                    .then(async resp => {
                        const data = await resp.json()
                        if (!resp.ok) {
                            const error = (data && data.message) || resp.status
                            return Promise.reject(error)
                        }
                        this.token = data.token
                        localStorage.setItem('token', this.token)
                        const headers = {
                            'Authorization': 'Bearer ' + this.token
                        };
                        await fetch(this.$serviceBaseUrl + 'Account/UserInformation?stoken=' + this.token, { headers })
                            .then(async resp => {
                                const data = await resp.json()
                                if (resp.ok) {
                                    localStorage.setItem('firstname', data.firstname)
                                    localStorage.setItem('lastname', data.lastname)
                                    localStorage.setItem('email', data.email)
                                    localStorage.setItem('confirmed', data.confirmed)
                                    localStorage.setItem('securityAnswer', data.securityAnswer)
                                    localStorage.setItem('initial', data.avatar)
                                    localStorage.setItem('consentDataProcessing', data.consentDataProcessing)
                                }
                            })
                        hideSpinner(document.getElementById('container'));
                        this.opacity = 1;
                        this.$router.push({ name: 'home' })
                    })
                    .catch((err) => {
                        hideSpinner(document.getElementById('container'));
                        this.opacity = 1;
                        switch (err) {
                            case 401:
                                {
                                    this.$refs.toastRef.show({
                                        title: 'Fehler bei der Anmeldung', content: 'Login fehlerhaft. Benutzer ist unbekannt oder das Password ist nicht korrekt.',
                                        icon: 'e-error'
                                    });
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
        padding: 10px;
        max-width: 400px;
        padding-top: 10px;
        background-color: rgba(255, 255, 255, 0.5);
        font-weight: bolder;
    }

    .eyeclass {
        float: right;
        position: relative;
        top: -22px;
        right: 5px;
    }

    .otp-container {
        width: 240px;
        margin: 50px auto;
    }

    .otp-container label {
        margin-bottom: 15px;
    }
</style>
