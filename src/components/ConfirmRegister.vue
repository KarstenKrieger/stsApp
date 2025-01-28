<template>
    <div id='container' class="center">
        <div class="e-card-header center">
            <div class="e-card-header-caption center">
                <img src="https://sts-finanzen.de/wp-content/uploads/2020/04/Schumacher_FuC_Logo_RGB_450x70.png"  height="180px"/>
                <p class="center">Registrierungsbestätigung bei STS-Finanzen-App</p>
            </div>
        </div>
        <div class="e-card-content center">
            <div>
                <div class="e-float-input e-input-group">
                    <label class="e-float-text">Registrierungs-Code</label>
                </div>
                <div class="e-float-input e-input-group">
                    <ejs-textbox floatLabelType="Never" placeholder="XXXX XXXX XXXX" v-model="confirmcode"></ejs-textbox>
                </div>
                <ejs-textbox floatLabelType="Auto" placeholder="Vorname" v-model="firstname"></ejs-textbox>
                <ejs-textbox floatLabelType="Auto" placeholder="Nachname" v-model="lastname"></ejs-textbox>
            </div>
            <div>
                <p>Sicherheitsfrage für die Password-Wiederherstellung:</p>
                <ejs-dropdownlist id='secureQuestionid' :dataSource='secureQuestions' :value="selectedQuestion" placeholder='Sicherheitsfrage'></ejs-dropdownlist>
                <ejs-textbox ref="pwd" :htmlAttributes="htmlAttributes" floatLabelType="Auto" placeholder="Antwort" v-model="secureAnswer"></ejs-textbox>
                <span v-if="showpw" class="e-icons e-eye eyeclass" v-on:click="showpw = !showpw"></span>
                <span v-if="!showpw" class="e-icons e-eye-slash eyeclass" v-on:click="showpw = !showpw"></span>
            </div>
        </div>
        <div class="e-card-content center">
            <div class="buttonClassL">
                <ejs-button cssClass='e-primary' :disabled="!noregister" v-on:click="register" v-if="!success">Bestätigen</ejs-button>
            </div>
        </div>
    </div>
    <div class="msgclass">
        <ejs-message v-if="error" id="msg_error_outlined" severity="Error">{{ errorMsg }}</ejs-message>
        <ejs-message v-if="regError" id="msg_error_reg" severity="Error">Die Registrierungs-Bestätigung wurde nicht erfolgreich abgeschlossen.</ejs-message>
        <ejs-message v-if="success" id="msg_success_reg" severity="Success">Die Registrierungs-Bestätigung wurde erfolgreich abgeschlossen. Sie können sich jetzt am System anmelden.</ejs-message>
    </div>
</template>

<script>
    import { TextBoxComponent } from "@syncfusion/ej2-vue-inputs";
    import { ButtonComponent } from "@syncfusion/ej2-vue-buttons";
    import { MessageComponent } from '@syncfusion/ej2-vue-notifications';
    import { DropDownListComponent } from "@syncfusion/ej2-vue-dropdowns";

    export default {
        components: {
            'ejs-textbox': TextBoxComponent,
            'ejs-button': ButtonComponent,
            'ejs-message': MessageComponent,
            'ejs-dropdownlist': DropDownListComponent
        },
        data() {
            return {
                firstname: '',
                lastname: '',
                secureAnswer: '',
                confirmcode: '',
                showpw: true,
                pwtype: 'password',
                htmlAttributes: '',
                noregister: false,
                success: false,
                regError: false,
                selectedQuestion: null,
                secureQuestions: []
            }
        },
        created: function () {
            if (this.$route.query.code) { this.confirmcode = this.$route.query.code }
            this.getSecureQuestions().then(() => { this.selectedQuestion = this.secureQuestions[Math.floor(Math.random() * this.secureQuestions.length)] })
        },
        watch: {
            secureAnswer: function (value) {
                this.noregister = false
                if (value && this.lastname && this.confirmcode && this.firstname) {
                    this.noregister = true
                }
            },
            firstname: function (value) {
                this.noregister = false
                if (value && this.lastname && this.confirmcode && this.secureAnswer) {
                    this.noregister = true
                }
            },
            lastname: function (value) {
                this.noregister = false
                if (value && this.secureAnswer && this.confirmcode && this.firstname) {
                    this.noregister = true
                }
            },
            confirmcode: function (value) {
                this.noregister = false
                if (value && this.lastname && this.secureAnswer && this.firstname) {
                    this.noregister = true
                }
            },
            showpw: function (value) {
                this.$refs.pwd.$el.type = value ? 'text' : 'password'
            }
        },
        mounted() {
            this.error = false;
            this.showpw = false;

        },
        methods: {
            async getSecureQuestions() {
                this.regError = false
                this.success = false
                this.error = false
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'content-type': 'application/json',
                        'Accept': 'application/json'
                    }
                }

                await fetch(this.$serviceBaseUrl + 'Account/SecureQuestions', requestOptions)
                    .then(async resp => {
                        this.secureQuestions = await resp.json()
                        if (!resp.ok) {
                            this.regError = true
                            this.noregister = false
                        }
                    })
                    .catch((err) => {
                        this.showError('Unterstützungsdienste sind nicht erreichbar oder login fehlerhaft. ' + err)
                        this.noregister = false
                    })
            },
            showError(err) {
                this.error = true
                this.errorMsg = err
            },
            async register() {
                this.regError = false
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
                    body: JSON.stringify({ confirmcode: this.confirmcode, firstname: this.firstname, lastname: this.lastname, securityanswer: this.securityanswer })
                }

                await fetch(this.$serviceBaseUrl + 'Account/Confirm', requestOptions)
                    .then(async resp => {
                        await resp.json()
                        if (!resp.ok) {
                            this.alreadyReg = true
                            this.noregister = false
                        }
                        this.success = !this.alreadyReg
                    })
                    .catch((err) => {
                        this.showError('Unterstützungsdienste sind nicht erreichbar oder login fehlerhaft. ' + err)
                        this.noregister = false
                    })
            }
        }
    }
</script>
<style>
    .center {
        margin: auto;
        width: 60%;
        padding: 10px;
    }

    .buttonClassR {
        float: right;
    }

    .buttonClassL {
        float: left;
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
