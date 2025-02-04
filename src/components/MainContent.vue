<template>
    <div class="container">
        <div class="dashboard-default dashboard-main">
            <ejs-dashboardlayout ref="dashboard" :columns="5" id='defaultLayout' :allowResizing="true" :cellSpacing="spacing">
                <e-panels>
                    <e-panel></e-panel>
                </e-panels>
            </ejs-dashboardlayout>
        </div>
        <div id="content"></div>
    </div>
</template>
<script>
    // import headers from "../lib/headers.js"
    import { createApp } from "vue";
    import { DashboardLayoutComponent, PanelsDirective, PanelDirective } from "@syncfusion/ej2-vue-layouts";
    import router from '../router'

    export default {
        components: {
            'ejs-dashboardlayout': DashboardLayoutComponent,
            'e-panel': PanelDirective,
            'e-panels': PanelsDirective
        },
        data() {
            return {
                token: localStorage.getItem('token'),
                error: false,
                errorMsg: '',
                spacing: [10, 10],
                panels: [],
                panelShow: 0,
                contactData: {},
                salutation: '',
                isLead: false,
                consentDataProcessingText: ''
            }
        },
        watch: {
            panelShow: function (value) {
                if (value == 0)
                    this.addPanel(this.panels[0]);
            }
        },
        mounted: async function () {
            if (!this.token)
                router.push('login');
            this.contactData = await this.getCustomerInformation();
            if (!this.isLead) {
                this.addPanel(0, 0, 0, 1, 1, '... Willkommen auf unserem Portal!', '<div style="padding: 10px; color:black;"><p>Herzlich Willkommen auf unserer STSApp, ' + this.salutation + '!</p><p>Ihrer zentralen Anlaufstelle für die Verwaltung Ihrer persönlichen, finanziellen und kommunikativen Daten. Unser Ziel ist es, Ihnen eine sichere und benutzerfreundliche Plattform zu bieten, auf der Sie jederzeit und von überall aus Ihre Informationen verwalten können.</p><h4>Was Sie hier tun können:</h4><ul><li><strong>Persönliche Daten verwalten</strong>: Halten Sie Ihre persönlichen Informationen stets aktuell.</li><li><strong>Finanzdaten erfassen und einsehen</strong>: Behalten Sie den Überblick über Ihre finanzbezogenen Informationen.</li><li><strong>Kommunikation optimieren</strong>: Nutzen Sie unsere sicheren Kanäle, um schnell und effizient zu kommunizieren.</li><li><strong>Dokumente hochladen und organisieren</strong>: Laden Sie wichtige Unterlagen sicher hoch und greifen Sie jederzeit darauf zu.</li></ul><h4>Ihre Sicherheit ist uns wichtig!</h4><p>Wir legen höchsten Wert auf Datenschutz und Datensicherheit. Ihre Informationen werden mit modernsten Technologien geschützt und nur für die Zwecke verwendet, denen Sie ' + this.consentDataProcessingText +' haben. Sie können die Zustimmung in Ihrem Profil ändern.</p><h4>Einfach. Sicher. Transparent.</h4><p>Melden Sie sich an und erleben Sie, wie einfach es ist, Ihre Daten und Dokumente an einem Ort zu verwalten. Sollten Sie Fragen haben, steht Ihnen unser Support-Team jederzeit zur Verfügung.</p><p>Wir freuen uns, Sie auf der STSApp begrüßen zu dürfen!</p></div>');
            }
            else
                this.addPanel(0, 0, 0, 1, 1, 'Willkommen auf unserem Portal!', '<div style="padding: 10px; color:black;"><p>Herzlich Willkommen auf unserer STSApp, UNBEKANNT <br/>Ihrer zentralen Anlaufstelle für die Verwaltung Ihrer persönlichen, finanziellen und kommunikativen Daten. Unser Ziel ist es, Ihnen eine sichere und benutzerfreundliche Plattform zu bieten, auf der Sie jederzeit und von überall aus Ihre Informationen verwalten können.</p><h4>Was Sie hier tun können:</h4><ul><li><strong>Persönliche Daten verwalten</strong>: Halten Sie Ihre persönlichen Informationen stets aktuell.</li><li><strong>Finanzdaten erfassen und einsehen</strong>: Behalten Sie den Überblick über Ihre finanzbezogenen Informationen.</li><li><strong>Kommunikation optimieren</strong>: Nutzen Sie unsere sicheren Kanäle, um schnell und effizient zu kommunizieren.</li><li><strong>Dokumente hochladen und organisieren</strong>: Laden Sie wichtige Unterlagen sicher hoch und greifen Sie jederzeit darauf zu.</li></ul><h4>Ihre Sicherheit ist uns wichtig!</h4><p>Wir legen höchsten Wert auf Datenschutz und Datensicherheit. Ihre Informationen werden mit modernsten Technologien geschützt und nur für die Zwecke verwendet, denen Sie zugestimmt haben. Sie können die Zustimmung in Ihrem Profil ändern.</p><h4>Einfach. Sicher. Transparent.</h4><p>Melden Sie sich an und erleben Sie, wie einfach es ist, Ihre Daten und Dokumente an einem Ort zu verwalten. Sollten Sie Fragen haben, steht Ihnen unser Support-Team jederzeit zur Verfügung.</p><p>Wir freuen uns, Sie auf der STSApp begrüßen zu dürfen!</p></div>');
        },

        methods: {
            showError(err) {
                this.error = true
                this.errorMsg = err
            },
            addPanel: function (pid, row, col, panelHeigt, panelWith, header, content) {
                var panel = [{
                    'id': 'layout_' + pid.toString(), 'sizeX': panelWith, 'sizeY': panelHeigt, 'row': row, 'col': col,
                    header: '<span id="close" class= "e-template-icon e-clear-icon"> </span><div class="e-panel-header">' + header + '</div >',
                    content: content
                }];
                this.panels.push(panel);
                this.panelShow++;
                this.$refs.dashboard.$el.ej2_instances[0].addPanel(panel[0]);
                var closeIcon = document.getElementById('layout_' + pid.toString()).querySelector('.e-clear-icon');
                closeIcon.addEventListener('click', this.onCloseIconHandler);
            },
            onCloseIconHandler: function (event) {
                if (event.target.offsetParent) {
                    this.$refs.dashboard.removePanel(event.target.offsetParent.id);
                }
                this.panelShow--;
            },
            getCustomerInformation: async function () {
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

                await fetch(this.$serviceBaseUrl + 'Contact/GetContactData', requestOptions)
                    .then(async resp => {
                        this.contactData = await resp.json()
                        this.salutation = this.contactData.jsonData[1].value + ' ' + this.contactData.jsonData[2].value + ' ' + this.contactData.jsonData[4].value
                        this.consentDataProcessingText = localStorage.getItem("consentDataProcessing") == "true" ? "zugestimmt" : "<b>noch nicht zugestimmt</b>"

                        if (!resp.ok) {
                            isLead = true;
                        }
                    })
                    .catch((err) => {
                        this.showError('Unterstützungsdienste sind nicht erreichbar oder login fehlerhaft. ' + err)
                    })
            }
        }
    }
</script>
<style>
    .container {
        width: 98%;
    }

    .dashboard-main {
        margin-top: 10px;
    }

    .headerText th {
        font-size: 1em;
    }

    .yellow tbody + tbody, .yellow td, .yellow th, .yellow thead th {
        background-color: lightgoldenrodyellow !important;
        color: darkslategrey !important;
    }

    .green tbody + tbody, .green td, .green th, .green thead th {
        background-color: green !important;
        color: white !important;
    }

    .e-dashboardlayout.e-control .e-panel .e-panel-container .e-resize.e-dl-icon {
        color: currentColor;
        font-size: 20px;
        height: 20px;
        width: 20px;
        bottom: 0px;
    }

    .dashboard-default #defaultLayout.e-dashboardlayout.e-control .e-panel:hover span {
        display: block;
    }

    .dashboard-default #defaultLayout .e-panel .e-panel-container .text-align {
        vertical-align: middle;
        font-weight: 600;
        font-size: 20px;
        text-align: center;
    }

    .dashboard-default .e-template-icon {
        padding: 10px;
        float: right;
        display: none;
    }

    .dashboard-default .e-clear-icon::before {
        content: '\e7a7';
        font-size: 12px;
        font-family: 'e-icons';
    }

    .bootstrap4 .dashboard-default .e-clear-icon::before {
        content: '\e745';
    }

    .tailwind .dashboard-default .e-clear-icon::before, .tailwind-dark .dashboard-default .e-clear-icon::before {
        content: '\e771';
        font-size: 16px;
    }

    .bootstrap5 .dashboard-default .e-clear-icon::before, .bootstrap5-dark .dashboard-default .e-clear-icon::before {
        content: '\e7e7';
        font-size: 16px;
    }

    .dashboard-default .text-align {
        line-height: 160px;
    }

    .dashboard-default .e-clear-icon {
        position: absolute;
        right: 0;
        cursor: pointer;
    }

    .dashboard-default .e-panel {
        overflow: scroll;
    }

    body.tailwind-dark .e-dashboardlayout.e-control .e-panel {
        border: 1px solid #d7d7d7;
    }
</style>
