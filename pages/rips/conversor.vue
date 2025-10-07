<template>
    <v-layout row wrap>
        <v-flex xs12>
            <v-card>
                <v-alert class="text-center" type="info" icon="mdi-checkbox-marked-circle-plus-outline" dense text
                    border="left">
                    <b>EXCEL A .JSON</b></v-alert>
                <v-card-text>
                    <v-layout row wrap>
                        <v-flex xs10 sm10>
                            <v-file-input accept="*/*" label="Archivo Excel" v-model="fileName" outline clearable
                                @click:clear="clearMessage()"></v-file-input>
                        </v-flex>
                        <v-flex xs1 px-2>
                            <v-btn color="success" :loading="loading" rounded @click="conversor(1)">Descargar
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-card>
        </v-flex>
        <hr>
        <br>
        <v-flex xs12>
            <v-card>
                <v-alert class="text-center" type="info" icon="mdi-checkbox-marked-circle-plus-outline" dense text
                    border="left">
                    <b>.JSON A EXCEL</b></v-alert>
                <v-card-text>
                    <v-layout row wrap>
                        <v-flex xs10 sm10>
                            <v-file-input accept="*/*" label="Archivo .JSON" v-model="fileName2" outline clearable
                                @click:clear="clearMessage()"></v-file-input>
                        </v-flex>
                        <v-flex xs1 px-2>
                            <v-btn color="success" :loading="loading" rounded @click="conversor(2)">Descargar
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-card>
        </v-flex>

    </v-layout>
</template>
<script>
import { mapActions } from "vuex";
export default {
    name: 'Conversores',
    data: () => {
        return {
            loading: false,
            fileName: null,
            fileName2: null,
            preload: false
        }
    },
    methods: {
        ...mapActions("app", ["setPreload"]),
        conversor(tipo) {
            this.setPreload(true);
            const formData = new FormData();
            if (tipo === 1) {
                formData.append('archivo', this.fileName);
            } else {
                formData.append('archivo', this.fileName2);
            }
            this.$axios.post('rips/conversor/' + tipo, formData, {
                responseType: (tipo === 1 ? 'text' : 'blob')
            }).then(res => {
                switch (tipo) {
                    case 1:
                        const jsn = JSON.stringify(res.data);
                        let blob = new Blob([jsn], {
                            type: "application/json"
                        });
                        let url = window.URL.createObjectURL(blob);
                        let a = document.createElement('a');
                        a.download = 'ArchivoGenerado.json';
                        a.href = url;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        break;
                    case 2:
                        let blob2 = new Blob([res.data], {
                            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        });
                        let url2 = window.URL.createObjectURL(blob2);
                        let a2 = document.createElement('a');

                        a2.download = `RegistroExcel.xlsx`;
                        a2.href = url2;
                        document.body.appendChild(a2);
                        a2.click();
                        document.body.removeChild(a2);
                        break;
                }
                this.$refs.fileInput.value = null;
                this.$refs.fileInput2.value = null;
                // this.clearMessage();
                this.loading = false;
                this.preload = false;
            }).catch(e => {
                console.log(e.response)
                // this.clearMessage();
                this.$refs.fileInput.value = null;
                this.$refs.fileInput2.value = null;
                this.preload = false;
                this.loading = false;
                this.$alerError("Error en la estructura del archivo.");
            }).finally(() => this.setPreload(false)) 
        }
    }
}
</script>
