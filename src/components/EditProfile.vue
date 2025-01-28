<template>
    <div id='container' class="center">
        <div class="e-card-header center">
            <div class="e-card-header-caption center">
                <p class="center">Profil ändern</p>
            </div>
        </div>
        <div class="e-card-content center">
            <div class="col-lg-8 control-section file-preview">
                <div class="control_wrapper">
                    <!-- Initialize Uploader -->
                    <div id="dropArea" class="uploader-image-preview-drop-area" style="height: auto; overflow: hidden">
                        <div>Avatar</div>
                        <span class="text-middle">Aktuelles Bild</span><div class="e-avatar e-avatar-normal e-avatar-circle"><img :src="avatar" /></div>
                        <ejs-uploader id='imagePreview' name="UploadFiles" :asyncSettings="path" ref="uploadObj" :allowedExtensions='extensions'
                                      :dropArea="dropElement" :selected="onFileSelect" :buttons="buttons"
                                      cssClass='uploader-preview'>
                        </ejs-uploader>
                    </div>
                </div>
            </div>
        </div>
        <div class="e-card-content center">
            <div>
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
            <div class="buttonClassL e-secondary">
                <ejs-button cssClass='e-secondary' v-on:click="cancel">Abbrechen</ejs-button>
            </div>
            <div class="buttonClassR e-primary">
                <ejs-button cssClass='e-primary' v-on:click="saveProfile" v-if="!success">Speichern</ejs-button>
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
    import { UploaderComponent } from '@syncfusion/ej2-vue-inputs';
    import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';


    export default {
        components: {
            'ejs-textbox': TextBoxComponent,
            'ejs-button': ButtonComponent,
            'ejs-message': MessageComponent,
            'ejs-dropdownlist': DropDownListComponent,
            'ejs-uploader': UploaderComponent
        },
        data() {
            return {
                avatar: localStorage.getItem('initial'),
                buttons: { browse: "Datei wählen", clear: "Alle löschen", upload: "" },
                token: localStorage.getItem("token"),
                isSequential: false,
                isAuto: false,
                dropElement: '.control-fluid',
                extensions: '.jpg, .png',
                fileList: [],
                filesDetails: [],
                parentElement: '',
                progressbarContainer: '',
                firstname: localStorage.getItem('firstname'),
                lastname: localStorage.getItem('lastname'),
                secureAnswer: localStorage.getItem('securityAnswer').substring(2),
                secureQuestion: parseInt(localStorage.getItem('securityAnswer').charAt(0) - 1),
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
            this.secureQuestion = this.secureQuestion == -1 ? Math.floor(Math.random() * this.secureQuestions.length) : this.secureQuestion
            this.getSecureQuestions().then(() => { this.selectedQuestion = this.secureQuestions[this.secureQuestion] })
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
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + this.token
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
                    }).then(() => {
                    //    fetch(this.$serviceBaseUrl + 'Account/GetUserInfo', requestOptions)
                    //        .then(async respInfo => {
                    //            var userinfo = await respInfo.json();
                    //            var avatar = 'data:image/jpeg;base64,' + userinfo.avatar
                    //            localStorage.setItem('initial', avatar );
                    //            var image = document.getElementById("imagePreview");
                    //            image.src = avatar;
                    //    })
                    })
            },
            showError(err) {
                this.error = true
                this.errorMsg = err
            },
            async saveProfile() {
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
            },
            cancel() {
                this.$router.push('/')
            },
            onFileSelect: function (args) {
                //if (!document.querySelector(this.dropElement).querySelector('li')) {
                //    this.filesDetails = [];
                //}
                if (isNullOrUndefined(document.getElementById('dropArea').querySelector('.e-upload-files'))) {
                    this.parentElement = createElement('ul', { className: 'e-upload-files' });
                    document.getElementsByClassName('e-upload')[0].appendChild(this.parentElement);
                }
                for (let i = 0; i < args.filesData.length; i++) {
                    this.formSelectedData(args.filesData[i], this);
                }
                this.filesDetails = this.filesDetails.concat(args.filesData);
                args.cancel = true;
            },
            formSelectedData: function (file) {
                let liEle = createElement('li', { className: 'e-upload-file-list', attrs: { 'data-file-name': file.name } });
                let imageTag = createElement('IMG', { className: 'upload-image', attrs: { 'alt': 'Image' } });
                let wrapper = createElement('span', { className: 'wrapper' });
                wrapper.appendChild(imageTag); liEle.appendChild(wrapper);
                liEle.appendChild(createElement('div', { className: 'name file-name', innerHTML: file.name, attrs: { 'title': file.name } }));
                liEle.appendChild(createElement('div', { className: 'file-size', innerHTML: this.$refs.uploadObj.bytesToSize(file.size) }));
                let clearbtn, uploadbtn;
                clearbtn = createElement('span', { id: 'removeIcon', className: 'e-icons e-file-remove-btn', attrs: { 'title': 'Remove' } });
                let localObj = this;
                clearbtn.addEventListener('click', function (e) {
                    localObj.removeFiles(e);
                })
                liEle.setAttribute('title', 'Ready to Upload');
                uploadbtn = createElement('span', { className: 'e-upload-icon e-icons e-file-remove-btn', attrs: { 'title': 'Upload' } });
                uploadbtn.setAttribute('id', 'iconUpload');
                uploadbtn.addEventListener('click', function (e) {
                    localObj.uploadFile(e);
                });
                this.progressbarContainer = createElement('progress', { className: 'progressbar', id: 'progressBar', attrs: { value: '0', max: '100' } });
                liEle.appendChild(clearbtn);
                liEle.appendChild(uploadbtn);
                liEle.appendChild(this.progressbarContainer);
                this.readURL(liEle, file);
                document.querySelector('.e-upload-files').appendChild(liEle);
                this.fileList.push(liEle);
            },
            readURL: function (li, args) {
                let preview = li.querySelector('.upload-image');
                let file = args.rawFile;
                let reader = new FileReader();
                reader.addEventListener('load', function () {
                    preview.src = reader.result;
                    localStorage.setItem('initial', preview.src);
                }, false);
                if (file) {
                    reader.readAsDataURL(file);
                }
            }
        }
    }
</script>
<style scoped>
    .default-sample .control_wrapper {
        max-width: 450px;
        min-width: 245px;
        margin: auto;
    }

    #defaultfileupload .e-upload.e-control {
        position: relative;
        margin: 15px 0;
    }

    .e-upload.specific .e-upload-files .e-file-delete-btn.e-icons::before,
    .e-upload.specific .e-upload-files .e-icons.e-file-reload-btn::before,
    .e-upload.specific .e-upload-files .e-file-remove-btn.e-icons::before,
    .e-upload.specific .e-upload-files .e-file-abort-btn.e-icons::before {
        margin-top: 3px;
    }
</style>
<style>
    .upload-image {
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }

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
    .e-upload {
        width: 99%
    }
</style>
