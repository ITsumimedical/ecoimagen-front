<template>
    <v-dialog v-model="dialog" persistent max-width="800px">
        <v-card class="pa-3">
            <v-card-title>
                <v-icon color="primary" left>mdi-upload</v-icon>
                Carga Masiva de Afiliados
            </v-card-title>

            <v-card-text>
                <v-alert dense type="info" text border="left">
                    Selecciona el archivo Excel con la estructura correspondiente para realizar la carga masiva de
                    afiliados.
                </v-alert>

                <v-file-input v-model="archivo" label="Seleccionar archivo Excel" accept=".xlsx, .xls" outlined dense
                    prepend-icon="mdi-file-excel" show-size></v-file-input>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="justify-end">
                <v-btn color="success" outlined small @click="descargarPlantillaExcel">
                    <v-icon left small>mdi-file-download</v-icon>
                    Descargar Plantilla
                </v-btn>

                <v-btn color="primary" :disabled="!archivo" small class="ml-2" @click="subirArchivo">
                    <v-icon left small>mdi-cloud-upload</v-icon>
                    Subir Archivo
                </v-btn>

                <v-btn color="error" small class="ml-2" @click="cerrar">
                    <v-icon left small>mdi-close</v-icon>
                    Cancelar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import {
    mapActions
} from "vuex";
export default {
    name: 'CargaMasivaAfiliadoComponente',
    props: {
        value: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            archivo: null,
        };
    },
    computed: {
        dialog: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            },
        },
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        cerrar() {
            this.dialog = false;
            this.archivo = null;
        },

        subirArchivo() {
            if (!this.archivo) {
                this.$toast.error("Por favor selecciona un archivo.");
                return;
            }

            this.setPreload(true);

            const formData = new FormData();
            formData.append("archivo", this.archivo);

            this.$axios.post("/afiliados/carga-masiva", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
                .then(() => {
                    this.$toast.success("Archivo cargado correctamente. Se procesará en segundo plano.");
                    this.cerrar();
                    this.setPreload(false);
                    return this.$swal({
                        title: "Carga masiva de afiliados",
                        text: "El archivo se está procesando. Recibirás una notificación cuando el proceso haya finalizado a tu correo electrónico.",
                        type: "success",
                    });
                })
                .catch((error) => {
                    this.$toast.error(error.response?.data?.error || "Error al cargar el archivo.");
                }).finally(() => {
                    this.setPreload(false);
                });
        },

        descargarPlantillaExcel() {
            this.$axios.get("/afiliados/estructura-carga-excel", {
                responseType: 'blob',
            })
                .then(res => {
                    const blob = new Blob([res.data], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'estructura_afiliados.xlsx';
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch((error) => {
                    this.$toast.error(error.response?.data?.mensaje || "Error al descargar la plantilla.");
                });
        },
    },
};
</script>
