<template>
    <div class="container">
        <div class="dashboard-default dashboard-main">
            <ejs-dashboardlayout ref="dashboard" :columns="5" id='defaultLayout' :allowResizing="true" :cellSpacing="spacing">
                <e-panels>
                    <e-panel id="layout_0" :row="0" :col="0" :sizeX="1" :sizeY="1" header="<span id='close' class='e-template-icon e-clear-icon'> </span><div class='e-panel-header'></div>'" content="<div class='panel-content'>Content Area</div>"></e-panel>
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
                contactData: {},
                dashboardMessages: {},
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
            await this.getCustomerInformation();
            await this.getDashboardMessages();
            this.$refs.dashboard.removePanel('layout_0');
            this.dashboardMessages.sort((a, b) => a.sortorder - b.sortorder)
            this.dashboardMessages.forEach((m) => {
                var row = m.sortorder % 5;
                var col = Math.floor(m.sortorder / 5);
                m.message = m.message.replace("##salutation##", this.salutation);
                m.message = m.message.replace("##consentdataprocessingtext##", this.consentDataProcessingText);
                this.addPanel(m.sortorder, col, row, 1, 1, m.title, '<div style="padding: 10px; color:black;">' + m.message + '</div>');
            })
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
                this.$refs.dashboard.$el.ej2_instances[0].addPanel(panel[0]);
                this.panelShow++;
                var closeIcon = document.getElementById('layout_' + pid.toString()).querySelector('.e-clear-icon');
                closeIcon.addEventListener('click', this.onCloseIconHandler);
            },
            onCloseIconHandler: function (event) {
                if (event.target.offsetParent) {
                    if (event.target.offsetParent.id != 'layout_0')
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
            },
            getDashboardMessages: async function () {
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

                var selv = this;

                await fetch(this.$serviceBaseUrl + 'Contact/GetDashboardMessages', requestOptions)
                    .then(async resp => {
                        selv.dashboardMessages = await resp.json()
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
