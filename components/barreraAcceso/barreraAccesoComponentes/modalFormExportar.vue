<template>
    <v-dialog v-model="formExportar" persistent max-width="700px">
        <v-card>
            <v-card-title>
                <v-toolbar flat>
                    <v-toolbar-title>
                        <div class="d-flex align-center">
                            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
                            <span>Exportar Barreras de Acceso</span>
                        </div>
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </v-card-title>
            <v-container>
                <v-row>
                    <v-col cols="12" sm="12" md="6">
                        <v-text-field v-model="fecha.fecha_inicial" dense outlined label="Fecha inicial" type="date">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                        <v-text-field v-model="fecha.fecha_final" dense outlined label="Fecha final" type="date">
                        </v-text-field>
                    </v-col>
                </v-row>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small @click="cerrarModal()" dark color="error">Cerrar</v-btn>
                    <v-btn small @click="reporte()" dark color="info">Descargar</v-btn>
                </v-card-actions>
            </v-container>
        </v-card>
    </v-dialog>
</template>
<script>
import { mapActions } from 'vuex'

export default {
    props: {
        formExportar: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            fecha: {
                fecha_inicial: null,
                fecha_final: null,
            }
        }
    },

    methods: {
        ...mapActions('app', ['setPreload']),
        reporte() {
            this.setPreload(true);
            this.$axios({
                method: "post",
                params: {
                    fecha_inicial: this.fecha.fecha_inicial,
                    fecha_final: this.fecha.fecha_final,
                },
                url: "/barrera-acceso/reporte",
                responseType: "blob",
            })
                .then((res) => {
                    let blob = new Blob([res.data], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
                    });
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement("a");

                    a.download = "InformeBarreraAcceso.xlsx";
                    a.href = url;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);

                    this.$toast.success('El reporte se descargó correctamente.');
                    this.limpiar()
;                })
                .catch((err) => {
                    this.$toast.error('Error en descargar informe');
                })
                .finally(() => {
                    this.setPreload(false);
                });
        },

        limpiar() {
            this.fecha = {
                fecha_inicial: null,
                fecha_final: null,
            };
        },

        cerrarModal() {
            this.$emit("update:formExportar", false);
        },
    }
}
</script>
